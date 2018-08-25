import GraphQLJSON from 'graphql-type-json';
import { getInstanceDI } from '../di/di';
import { makeExecutableSchema } from 'apollo-server';
// import { ApolloServer, gql } from 'apollo-server';
import { ApolloServer, gql } from 'apollo-server-express';
import { UserService } from '../api/UserService';
import express from 'express';
import { GraphqlError, GraphqlResolver } from './util/GraphqlTypes';
import { getAuthDirectiveVisitor } from './directives/auth';
import { DateResolver } from './scalars/date';
// import sharedSchema from './shared-schema';
import authOperations from './operations/auth/auth';

const ConstraintDirective = require('graphql-constraint-directive');

const rootSchema = gql`
  scalar JSON

  scalar Date

  directive @auth(requires: [AuthRole] = []) on QUERY | MUTATION | FIELD

  enum AuthRole {
    user
    admin
  }

  directive @constraint(
    # String constraints
    minLength: Int
    maxLength: Int
    startsWith: String
    endsWith: String
    notContains: String
    pattern: String
    format: String

    # Number constraints
    min: Int
    max: Int
    exclusiveMin: Int
    exclusiveMax: Int
    multipleOf: Int
  ) on INPUT_FIELD_DEFINITION

  scalar ConstraintString

  scalar ConstraintNumber

  type Query {
    hi: String @auth
  }

  type Mutation {
    hi: String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

const rootResolver: GraphqlResolver = {
  Query: {
    hi: () => 'Hi'
  },
  Mutation: {
    hi: () => 'Hi'
  }
};

const scalarResolvers: GraphqlResolver = {
  Date: DateResolver,
  JSON: GraphQLJSON
};

const formatError = (error: GraphqlError) => {
  console.error('Error from graphql resolvers');
  console.error(error);
  console.error(error.originalError);
  const { message, path, extensions } = error as any;
  return {
    message,
    path,
    extensions: { code: (extensions || {}).code }
  };
};

const context = ({ req }: { req: express.Request }) => ({ req });
const schema = makeExecutableSchema({
  typeDefs: [
    rootSchema,
    ...authOperations.schema
    //sharedSchema
  ],
  resolvers: [rootResolver, scalarResolvers, ...authOperations.resolvers],
  schemaDirectives: {
    auth: getAuthDirectiveVisitor(getInstanceDI(UserService)),
    constraint: ConstraintDirective
  }
});

export const server = new ApolloServer({
  schema,
  formatError,
  context,
  tracing: true,
  cacheControl: true
  // mocks: {
  //   Date: () => new Date().getTime()
  // }
});
