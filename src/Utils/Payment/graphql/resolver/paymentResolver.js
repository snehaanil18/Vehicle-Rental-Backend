import paymentController from '../../Controller/paymentController.js';

const paymentResolver = {
  Query: {
    getAllPayments: async () => {
        return await paymentController.getAllPayments();
    }
  },
  Mutation: {
    createPaymentOrder: async (_, { amount }) => {
      return await paymentController.createOrder(amount);
    },
    verifyPayment: async (_, { orderId, paymentId, signature }) => {
      const success = paymentController.verifyPayment(orderId, paymentId, signature);
      return { success };
    },
    createPayment: async (_, { bookingId, amountPaid, status,pickupdate, dropoffdate,vehicleid}) => {     
      return await paymentController.createPaymentRecord(bookingId, amountPaid, status,vehicleid, pickupdate, dropoffdate);
    },
  },
};

export default paymentResolver;