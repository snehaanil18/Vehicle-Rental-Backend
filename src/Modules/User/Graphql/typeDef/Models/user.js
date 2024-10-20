import { gql } from 'apollo-server-express'

const userTypeDef = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    phone: String!
    city: String
    state: String
    country: String
    pincode: String
    password: String!
    profileimage: String
  }
`;

export default userTypeDef;