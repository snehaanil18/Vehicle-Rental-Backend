import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Mutation {
    sendOTP(phone: String!):sendOTPResponse
    verifyOTPf(phone: String!, otp: String!): sendOTPResponse
  }

  type sendOTPResponse{
    success: Boolean
    message:String
  }

`;

export default typeDefs;