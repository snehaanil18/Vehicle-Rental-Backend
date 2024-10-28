import paymentController from '../../Controller/paymentController.js';

const paymentResolver = {
  Query: {
    //get details of all payment
    getAllPayments: async () => {
        return await paymentController.getAllPayments();
    }
  },
  Mutation: {
    // Create a payment order
    createPaymentOrder: async (_, { amount }) => {
      return await paymentController.createOrder(amount);
    },

    // Verify payment
    verifyPayment: async (_, { orderId, paymentId, signature }) => {
      const success = paymentController.verifyPayment(orderId, paymentId, signature);
      return { success };
    },

    // Record payment details in the database
    createPayment: async (_, { bookingid, amountpaid, status,pickupdate, dropoffdate,vehicleid}) => {     
      return await paymentController.createPaymentRecord(bookingid, amountpaid, status,vehicleid, pickupdate, dropoffdate);
    },
  },
};

export default paymentResolver;