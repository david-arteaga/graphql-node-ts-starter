import passport from 'passport';
// import FacebookTokenStrategy from 'passport-facebook-token';
import { Strategy as JwtStrategy } from 'passport-jwt';
// import { fbConfig } from './fb-config';
// import { Profile } from 'passport-facebook-token';
import { UserService } from '../api/UserService';
import { jwtOptions, JwtPayload } from './jwt-config';
import { getInstanceDI } from '../di/di';
// import { Users } from '../model/models/Users';
// import { RegistrationService } from '../api/RegistrationService';

const userService = getInstanceDI(UserService);
// const registrationService = getInstanceDI(RegistrationService);

export const passportConfigureStrategies = () => {
  // passport.use(
  //   new FacebookTokenStrategy(
  //     {
  //       clientID: fbConfig.appId,
  //       clientSecret: fbConfig.appSecret
  //     },
  //     async (accessToken, _, profile, done) => {
  //       try {
  //         done(null, await upsertFbUser(accessToken, profile));
  //       } catch (e) {
  //         done(e, false);
  //       }
  //     }
  //   )
  // );

  passport.use(
    new JwtStrategy(jwtOptions, async (jwtPayload: JwtPayload, done) => {
      try {
        done(
          null,
          (await userService.getUserByIdWithRoles(jwtPayload.id)) || false
        );
      } catch (e) {
        done(e, false);
      }
    })
  );
};

// const upsertFbUser = async (
//   accessToken: string,
//   profile: Profile
// ): Promise<Users.Type> => {
//   const user = await userService.getUserModelByIdWithRoles(profile.id);

//   if (user) {
//     return await userService.updateFBDataForTouristUserModel(
//       user,
//       profile,
//       accessToken
//     );
//   } else {
//     return await registrationService.createNewFBTouristUser(
//       profile,
//       accessToken
//     );
//   }
// };
