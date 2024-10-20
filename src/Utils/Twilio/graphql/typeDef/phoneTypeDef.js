import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Mutation {
    sendOTP(phone: String!):sendOTPResponse
    verifyOTP(phone: String!, otp: String!): Boolean
  }

  type sendOTPResponse{
    success: Boolean
    message:String
  }

`;

export default typeDefs;