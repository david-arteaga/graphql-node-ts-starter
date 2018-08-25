import { gql } from 'apollo-server';
import { GraphqlResolver, GraphqlDefaultExport } from '../../util/GraphqlTypes';
import { RegistrationService } from '../../../api/RegistrationService';
import { getInstanceDI } from '../../../di';
import { AuthService } from '../../../api/AuthService';
import { Users } from '../../../model/models/Users';
import { UserService } from '../../../api/UserService';

const schema = gql`
  type User {
    id: ID!
    name: String

    email: String

    roles: [Role!]!
  }

  type Role {
    name: String!
  }

  # Mutation: registerUser
  extend type Mutation {
    registerUser(input: RegisterUserInput!): RegisterUserPayload!
  }

  input RegisterUserInput {
    user: RegisterUserData!
  }

  input RegisterUserData {
    name: String!
    email: String!
    password: String!
  }

  type RegisterUserPayload {
    user: User!
    token: String!
  }

  # Mutation: loginUser
  extend type Query {
    loginUser(input: LoginUserInput!): LoginUserPayload!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  type LoginUserPayload {
    user: User!
    token: String!
  }
`;

const resolver = (
  registrationService: RegistrationService,
  authService: AuthService,
  userService: UserService
) =>
  <GraphqlResolver>{
    Mutation: {
      registerUser: (
        _,
        { input: { user } }: { input: GQL.IRegisterUserInput }
      ) => registrationService.registerUser(user)
    },
    Query: {
      loginUser: (_, { input }: { input: GQL.ILoginUserInput }) =>
        authService.loginUser(input)
    },
    User: {
      roles: (user: GQL.IUser & Users.Type) =>
        user.roles ? user.roles : userService.getUserRoles(user)
    }
  };

export default <GraphqlDefaultExport>{
  schema: [schema],
  resolvers: [
    resolver(
      getInstanceDI(RegistrationService),
      getInstanceDI(AuthService),
      getInstanceDI(UserService)
    )
  ]
};
