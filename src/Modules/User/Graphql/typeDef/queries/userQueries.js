import { gql } from 'apollo-server-express'

const userQueries = gql`
  type Query {
    users: [User]
    user: User
  }
`;

export default userQueries;