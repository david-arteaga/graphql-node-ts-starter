import Bookshelf from 'bookshelf';
import postgisPlugin from './bookshelf-plugins/postgis';
import { getInstanceForSymbol, registerContantValueForSymbol } from '../di';
import Knex from 'knex';
import { KnexInstanceSymbol } from './connection/knex';

const knex = getInstanceForSymbol<Knex>(KnexInstanceSymbol);

export const bookshelf = Bookshelf(knex);
bookshelf.plugin('registry');
bookshelf.plugin('pagination');
bookshelf.plugin(postgisPlugin);

export const BookshelfType = Symbol('Bookshelf');
registerContantValueForSymbol(BookshelfType, bookshelf);
