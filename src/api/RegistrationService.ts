import { Injectable, Inject } from '../di/di';
import { Model } from '../model/model';
import { RegistrationError } from '../graphql/operations/auth/error';
import { Users } from '../model/models/Users';
import bcrypt from 'bcryptjs';
import { passwordSaltLengthForHash } from '../auth/constants';
import { getJwtToken } from '../auth/jwt-config';
import { Roles } from '../model/models/Roles';

@Injectable()
export class RegistrationService {
  constructor(@Inject(Model) private model: Model) {}

  /**
   * Create a new user in the database
   *
   * @param {GQL.IRegisterUserData} userData the data for which the user will be created
   * @returns the created user and a jwt token
   * @memberof RegistrationService
   */
  registerUser(userData: GQL.IRegisterUserData) {
    return this.model.bookshelf.transaction<GQL.IRegisterUserPayload>(
      async transacting => {
        const previousUser = await new this.model.Users({
          email: userData.email
        }).fetch({ transacting });
        if (previousUser !== null) {
          throw new Error(RegistrationError.emailExists);
        }

        const hashedPassword = await bcrypt.hash(
          userData.password,
          passwordSaltLengthForHash
        );

        const toCreate: Pick<Users.Type, 'name' | 'email' | 'password'> = {
          name: userData.name,
          email: userData.email,
          password: hashedPassword
        };

        const userModel = await new this.model.Users().save(toCreate, {
          transacting
        });

        userModel
          .roles()
          .attach(new this.model.Roles({ name: Roles.RoleName.user }), {
            transacting
          });

        const user = userModel.toJSON() as Users.Type;

        const token = getJwtToken(user);

        return {
          user: user as GQL.IUser,
          token
        };
      }
    );
  }
}
