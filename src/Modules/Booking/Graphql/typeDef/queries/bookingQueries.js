import { gql } from 'apollo-server-express'

const bookingQueries = gql`
  type Query {
    getBooking(id: ID!): Booking
    getBookingsByUser(userId: ID!): [Booking!]!
    getAllBookings: [Booking!]!
  }
`;

export default bookingQueries;