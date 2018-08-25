import Knex from 'knex';
import config from '../config/database';
import { registerContantValueForSymbol } from '../../di';

const knex: Knex = Knex(config);

export const KnexInstanceSymbol = Symbol('Knex');

registerContantValueForSymbol(KnexInstanceSymbol, knex);
