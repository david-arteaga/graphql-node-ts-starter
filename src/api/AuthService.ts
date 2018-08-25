import { Injectable, Inject } from '../di/di';
import { Model } from '../model/model';
import { AuthenticationError } from 'apollo-server';
import { LoginError } from '../graphql/operations/auth/error';
import { Users } from '../model/models/Users';
import bcrypt from 'bcryptjs';
import { getJwtToken } from '../auth/jwt-config';

@Injectable()
export class AuthService {
  constructor(@Inject(Model) private model: Model) {}

  async loginUser({
    email,
    password
  }: GQL.ILoginUserInput): Promise<GQL.ILoginUserPayload> {
    const userModel = await new this.model.Users({ email }).fetch();
    if (!userModel) {
      throw new AuthenticationError(LoginError.invalidEmail);
    }

    const user = userModel.toJSON() as Users.Type;

    if (!(await bcrypt.compare(password, user.password))) {
      throw new AuthenticationError(LoginError.invalidPassword);
    }

    return {
      user: user as GQL.IUser,
      token: getJwtToken(user)
    };
  }
}
