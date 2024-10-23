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
    ): sendOTPResponse



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

    loginUser(email: String!, password: String!): loginResponse

    updateProfileImage(id: ID!, file: Upload!): User

    verifyOTP(id:ID,phone: String!, otp: String!): sendOTPResponse
  }

  type sendOTPResponse{
    userId:ID
    success: Boolean
    message:String
  }

  type loginResponse {
    success: Boolean
    message: String,
    token: String,
    user: User
  }
`;

export default userMutations;