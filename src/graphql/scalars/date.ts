import { GraphQLScalarType, Kind } from 'graphql';
export const DateResolver = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue: value => new Date(value),
  serialize: (value: Date) => value.getTime(),
  parseLiteral: ast => (ast.kind === Kind.INT ? parseInt(ast.value, 10) : null)
});
