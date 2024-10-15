import db from '../../../../Config/DB/db.js'

const paymentRepository = {
  // Add a new payment record to the database
  async addPayment(paymentData) {

    const { bookingid, amountpaid, status } = paymentData;
    const query = `
      INSERT INTO payments (bookingid, amountpaid, status)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [bookingid, amountpaid, status];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0]; // Return the created payment record
    } catch (error) {
      console.error('Error adding payment to database:', error);
      throw new Error('Failed to add payment to database');
    }
  },

  async getAllPayments(){
    const query = 'SELECT * FROM payments';
    const result = await db.query(query);
    return result;
  }
};

export default paymentRepository;
