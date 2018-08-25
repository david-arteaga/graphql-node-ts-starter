import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

export const authenticateRequest = passport.authenticate('jwt', {
  session: false
});

export const tryAuthenticateAndLetThrough = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  passport.authenticate('jwt', { session: false }, (_, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
