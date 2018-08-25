import { migrationsConfig } from './config/migrations';
import { seedsConfig } from './config/seeds';
import { Injectable } from '../di';
import { inject } from 'inversify';
import { BookshelfType } from './bookshelf';
import Bookshelf from 'bookshelf';
import { Users } from './models/Users';
import { Roles } from './models/Roles';
import { APP_NAME } from '../app-name';

const debug = require('debug')(APP_NAME + ':model');

@Injectable()
export class Model {
  constructor(@inject(BookshelfType) public bookshelf: Bookshelf) {
    console.log('Running Model constructor');

    this.init();
  }

  /**
   * Configure the entities in this model
   */
  Users = Users;
  Roles = Roles;

  /**
   * Run the knex migrations and seeds configured for this model
   * @return {Promise<void>} The promise
   */
  private async init(): Promise<void> {
    debug('Running migrations...');
    // await this.bookshelf.knex.migrate.rollback(migrationsConfig);
    await this.bookshelf.knex.migrate.latest(migrationsConfig);
    debug('Running seeds...');
    return await this.bookshelf.knex.seed.run(seedsConfig);
  }
}
