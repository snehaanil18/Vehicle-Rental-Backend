import { gql } from 'apollo-server-express'

const bookingQueries = gql`
  type Query {
    getBooking(id: ID!): Booking
    getBookingsByUser(userid: ID!): [Booking!]!
    getAllBookings: [Booking!]!
  }
`;

export default bookingQueries;