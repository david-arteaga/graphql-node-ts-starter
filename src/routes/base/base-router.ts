import { Router } from 'express';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseRouter {
  router: Router;
  constructor() {
    this.router = Router();
  }
}
