import {
  SchemaDirectiveVisitor,
  AuthenticationError,
  ForbiddenError
} from 'apollo-server';
import {
  GraphQLField
  // GraphQLObjectType, GraphQLInterfaceType
} from 'graphql';
import { Users } from '../../model/models/Users';

interface AuthService {
  userHasRoleNames(user: Users.Type, roles: string[]): Promise<boolean>;
}

export const getAuthDirectiveVisitor = (authService: AuthService) =>
  class AuthDirectiveVisitor extends SchemaDirectiveVisitor {
    visitFieldDefinition(
      field: GraphQLField<any, any>
      // details: {
      //   objectType: GraphQLObjectType | GraphQLInterfaceType;
      // }
    ): GraphQLField<any, any> | void {
      // const isInQueryType = details.objectType.name === 'Query';
      // const isInMutationType = details.objectType.name === 'Mutation';

      // if (!(isInQueryType || isInMutationType)) {
      //   throw Error('Directive @auth can only be used in Mutations or Queries');
      // }

      const previousResolve = field.resolve;
      const requiredRoles = this.args.requires as string[];

      field.resolve = async (root, params, context, info) => {
        const user = context.req.user as Users.Type;
        if (!user) {
          throw new AuthenticationError('Invalid authentication');
        }

        if (!(await authService.userHasRoleNames(user, requiredRoles))) {
          console.log('needs', requiredRoles);
          console.log('has', user.roles!!.map(it => it.name));
          console.log('userid', user.id);
          throw new ForbiddenError('User does not have enough permissions');
        }

        return previousResolve
          ? previousResolve(root, params, context, info)
          : root[field.name];
      };

      return field;
    }
  };
