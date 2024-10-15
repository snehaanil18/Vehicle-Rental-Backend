import { gql } from 'apollo-server-express'

const bookingMutations = gql`
type Mutation {
    createBooking(
      vehicleid: String!,
      vehiclename: String!,
      pickupdate: String!,
      pickuplocation: String!,
      dropoffdate: String!,
      dropofflocation: String!,
      totalamount: Float!,
      username: String!,
      userid: String!,
      paymentstatus: PaymentStatus!
    ): BookingResult
  }

  
`;

export default bookingMutations;