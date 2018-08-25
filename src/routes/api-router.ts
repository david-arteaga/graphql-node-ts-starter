import { Request, Response } from 'express';
import { BaseRouter } from './base/base-router';
import { catch_async } from './base/util';
import { Injectable, Inject } from '../di';
import { UserService } from '../api/UserService';

@Injectable()
export class ApiRouter extends BaseRouter {
  constructor(@Inject(UserService) private userService: UserService) {
    super();
    this.router.get('/users', catch_async(this.getUsers));
  }

  getUsers = async (_: Request, res: Response) => {
    res.json(await this.userService.getAllUsers());
  };
}
