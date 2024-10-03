import { gql } from 'apollo-server-express'

const userQueries = gql`
  type Query {
    users: [User]
    user(id: ID!): User
  }
`;

export default userQueries;