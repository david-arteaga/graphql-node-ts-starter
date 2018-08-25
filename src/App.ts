import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';

import { Injectable } from './di/di';
import { tryAuthenticateAndLetThrough } from './auth/graphql-route-authentication-middleware';
import { APP_NAME } from './app-name';
import { passportConfigureStrategies } from './auth/passport-config';
import { server } from './graphql/server';

const debug = require('debug')(APP_NAME + ':App.ts');

@Injectable()
export class App {
  express: express.Application;

  constructor() {
    this.express = express();
    // TODO remove latency simulator
    // this.express.use((_, __, next) =>
    //   new Promise(res => setTimeout(() => res(), 1000)).then(() => next())
    // );
    this.middleware();
    // this.express.use((_, res) => res.status(400).end());
    this.configurePassport();
    this.routes();
  }

  private configurePassport = () => {
    passportConfigureStrategies();
    this.express.use(passport.initialize());
  };

  private middleware(): void {
    this.express.use(cors());
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.express.use('/api/graphql', tryAuthenticateAndLetThrough);

    server.applyMiddleware({
      app: this.express,
      path: '/api/graphql'
    });
    debug('Finished setting up graphql server');
  }
}
