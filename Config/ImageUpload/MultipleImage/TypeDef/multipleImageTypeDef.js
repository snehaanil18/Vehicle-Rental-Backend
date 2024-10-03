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
    uploadFiles(files: [Upload!]!): [File!]!  # Changed to accept an array of Upload types
  }
`;

export default typeDefs;