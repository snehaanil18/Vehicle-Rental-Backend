import { gql } from 'apollo-server-express';

const bookingTypeDef = gql`
  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    Pending
    Paid
    paid
    pending
    Failed
  }

  type Booking {
    id: ID!
    vehicleid: String!
    vehiclename: String!
    pickupdate: String! 
    pickuplocation: String!
    dropoffdate: String! 
    dropofflocation: String!
    totalamount: Float!
    username: String!
    userid: ID!
    paymentstatus: PaymentStatus! 
  }

  type BookingResult {
  success: Boolean!
  message: String
  booking: Booking
}
`;

export default bookingTypeDef;