
import { IResolvers } from 'apollo-server';
import { Request } from 'express';
import { DocumentNode } from 'graphql';
import { Subtract } from '../../utils/TypeUtil';

export interface GraphqlError {
  message?: string;
  locations: GraphqlErrorLocation[];
  path: string;
  originalError?: any;
}

export interface GraphqlErrorLocation {
  line: number;
  column: number;
}

export interface GraphqlContext {
  req: Request;
}

type Resolver<Source, Result> = {
  [P in keyof Subtract<Result, Source>]: (
    instance: Source
  ) => Partial<Result[P]>
};

export type GraphqlResolver<Context = GraphqlContext> = IResolvers<
  any,
  Context
>;

export const getResolver = <Source, Result>(
  resolver: Resolver<Source, Result>
) => resolver;

export interface GraphqlDefaultExport {
  schema: DocumentNode[];
  resolvers: GraphqlResolver[];
}
