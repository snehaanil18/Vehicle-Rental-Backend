import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type Query {
    getAllPayments: [Payment!]!
  }

  type Mutation {
    createPaymentOrder(amount: Float!): PaymentOrder!
    verifyPayment(orderId: String!, paymentId: String!, signature: String!): PaymentVerification!
    createPayment(bookingid: String!, amountpaid: Float!, status: String!,vehicleid: String!, pickupdate: String!,dropoffdate: String!,): Payment!
  }
 
  type PaymentOrder {
    id: String!
    currency: String!
    amount: Float!
  }

  type PaymentVerification {
    success: Boolean!
  }

  type Payment {
    id: ID
    bookingid: String
    amountpaid: Float
    status: String
    createdat: String
  }
`;

export default typeDefs;
