import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Notification {
    id: ID!
    userid: String!
    message: String!
  }

  type Query {
    getUserNotifications(userid: String!): [Notification]
  }
`;

export default typeDefs;