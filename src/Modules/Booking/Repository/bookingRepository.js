import pool from '../../../../Config/DB/db.js';

const bookingRepository = {
  // Fetch all bookings from the database
  async getAllBookings() {
    const query = 'SELECT * FROM bookings';
    const result = await pool.query(query);
    return result; // Return the result containing all bookings
  },

  // Fetch a single booking by ID
  async getBookingById(id) {
    const query = 'SELECT * FROM bookings WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result; // Return the result containing the booking
  },

  // Fetch bookings by user ID
  async getBookingsByUser(userId) {
    const query = 'SELECT * FROM bookings WHERE userId = $1';
    const result = await pool.query(query, [userId]);
    return result; // Return the result containing user's bookings
  },

  // Create a new booking
  async createBooking({ vehicleid, vehiclename, pickupdate, pickuplocation, dropoffdate, dropofflocation, totalamount, username, userid, paymentstatus }) {
    const query = `
      INSERT INTO bookings (vehicleId, vehicleName, pickUpDate, pickUpLocation, dropOffDate, dropOffLocation, totalAmount, userName, userId, paymentStatus)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`;
    const values = [vehicleid, vehiclename, pickupdate, pickuplocation, dropoffdate, dropofflocation, totalamount, username, userid, paymentstatus];
    const result = await pool.query(query, values);
    return result; // Return the result containing the created booking
  },

  // Update an existing booking by ID
  async updateBooking({ id, vehicleid, vehiclename, pickupdate, pickuplocation, dropoffdate, dropofflocation, totalamount, username, userid, paymentstatus }) {
    const query = `
      UPDATE bookings
      SET vehicleId = $1, vehicleName = $2, pickUpDate = $3, pickUpLocation = $4, dropOffDate = $5, dropOffLocation = $6, totalAmount = $7, userName = $8, userId = $9, paymentStatus = $10
      WHERE id = $11
      RETURNING *`;
    const values = [vehicleid, vehiclename, pickupdate, pickuplocation, dropoffdate, dropofflocation, totalamount, username, userid, paymentstatus, id];
    const result = await pool.query(query, values);
    return result; // Return the result containing the updated booking
  },

  // Delete a booking by ID
  async deleteBookingById(id) {
    const query = 'DELETE FROM bookings WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result; // Return the result containing the deleted booking
  },

  async updatePaymentStatus(bookingId, newStatus) {
    const query = `
    UPDATE bookings
    SET paymentstatus = $1
    WHERE id = $2
    RETURNING *; -- Optionally return the updated booking record
`;
    const values = [newStatus, bookingId];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }
};

export default bookingRepository;
