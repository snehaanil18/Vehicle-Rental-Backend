import Razorpay from 'razorpay';
import crypto from 'crypto';
import paymentRepository from '../Repository/paymentRepository.js'
import bookingRepository from '../../../Modules/Booking/Repository/bookingRepository.js';
import vehicleRepository from '../../../Modules/Vehicle/Repository/vehicleRepository.js';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentController = {
  // Create a payment order
  async createOrder(amount) {
    try {
      const order = await razorpay.orders.create({
        amount, 
        currency: 'INR',
        receipt: crypto.randomBytes(10).toString('hex'),
      });
      return order;
    } catch (error) {
      console.error('Error creating payment order:', error);
      throw new Error('Failed to create payment order');
    }
  },

  // Verify payment
  verifyPayment(orderId, paymentId, signature) {
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    return generatedSignature === signature;
  },

  // Record payment details in the database
  async createPaymentRecord(bookingid, amountpaid, status, vehicleid,pickupdate, dropoffdate) {
    try {
      const paymentData = {
        bookingid: bookingid,
        amountpaid: amountpaid,
        status: status,
      };
   
      
      const payment = await paymentRepository.addPayment(paymentData);
      await bookingRepository.updatePaymentStatus(bookingid, 'Paid');

      
      const startDate = new Date(pickupdate);
      const endDate = new Date(dropoffdate);
      const dateArray = [];
      const quantity = 1;
      let currentDate = startDate;

      
      while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
 
      
      for (const date of dateArray) {
        await vehicleRepository.updateAvailability({
          vehicleId: vehicleid,
          date,
          quantity, 
        });
      }
      
      return {
        bookingid: payment.bookingid , 
        amountpaid: payment.amountpaid,
        status: payment.status
    }; // Return the created payment record
    } catch (error) {
      console.error('Error saving payment record:', error);
      throw new Error('Failed to save payment record');
    }
  },

  async getAllPayments(){
    try{
      const result = await paymentRepository.getAllPayments();

     
      return result.rows
    } catch (err) {
      console.error('Error fetching Payments:', err);
      throw new Error('Failed to fetch Payments');
    }
  }
};

export default paymentController;
