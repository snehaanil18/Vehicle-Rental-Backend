import { gql } from 'apollo-server-express'

const userMutations = gql`
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
      password: String,
      phone: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    ): User

    deleteUser(id: ID!): User
  }
`;

export default userMutations;