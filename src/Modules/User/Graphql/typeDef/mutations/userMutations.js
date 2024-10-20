import { gql } from 'apollo-server-express'

const userMutations = gql`
scalar Upload

  type Mutation {
    createUser(
      name: String!,
      email: String!,
      password: String!,
      phone: String!,
      city: String,
      state: String,
      country: String,
      pincode: String
    ): User

    updateUser(
      id: ID!,
      name: String,
      email: String,
      phone: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    ): User

    deleteUser(id: ID!): User

    loginUser(email: String!, password: String!): User

    updateProfileImage(id: ID!, file: Upload!): User
  }
`;

export default userMutations;