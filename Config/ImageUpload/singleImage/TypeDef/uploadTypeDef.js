import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    uploadFile(file: Upload!): File!
  }
`;

export default typeDefs;
