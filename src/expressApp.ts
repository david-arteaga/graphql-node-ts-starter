import 'reflect-metadata';
import { getInstanceDI } from './di/di';
import { App } from './App';
import { APP_NAME } from './app-name';
const debug = require('debug')(APP_NAME + ':expressApp.ts');

const expressApp = getInstanceDI(App).express;
debug('Application initialized');

export default expressApp;
