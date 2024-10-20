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
    createPayment: async (_, { bookingid, amountpaid, status,pickupdate, dropoffdate,vehicleid}) => {     
      return await paymentController.createPaymentRecord(bookingid, amountpaid, status,vehicleid, pickupdate, dropoffdate);
    },
  },
};

export default paymentResolver;