import bookingRequest from '../Request/bookingRequest.js';
import bookingRepository from '../Repository/bookingRepository.js';
import vehicleController from '../../Vehicle/Controller/vehicleController.js';

const bookingController = {
  // Fetch all bookings
  async getAllBookings() {
    try {
      const result = await bookingRepository.getAllBookings();
      return result.rows; // Return the fetched bookings
    } catch (err) {
      console.error('Error fetching bookings:', err);
      throw new Error('Failed to fetch bookings');
    }
  },

  // Fetch a single booking by ID
  async getBookingById(id) {
    try {
      const result = await bookingRepository.getBookingById(id);
      if (result.rows.length > 0) {
        return result.rows[0]; // Return the booking
      } else {
        throw new Error('Booking not found');
      }
    } catch (err) {
      console.error(`Error fetching booking with id ${id}:`, err);
      throw new Error('Failed to fetch booking');
    }
  },

  // Fetch bookings by user ID
  async getBookingsByUser(userId) {
    try {
      const result = await bookingRepository.getBookingsByUser(userId);
      return result.rows; // Return the user's bookings
    } catch (err) {
      console.error(`Error fetching bookings for user with id ${userId}:`, err);
      throw new Error('Failed to fetch user bookings');
    }
  },

  // Create a new booking
  async createBooking({ vehicleid, vehiclename, pickupdate, pickuplocation, dropoffdate, dropofflocation, totalamount, username, userid, paymentstatus }) {
    // Validate booking input
    const { error } = bookingRequest.validateCreateBooking({ vehicleid, vehiclename, pickupdate, pickuplocation, dropoffdate, dropofflocation, totalamount, username, userid, paymentstatus });
    if (error) {
      throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    try {
      const availability = await vehicleController.checkVehicleAvailability(vehicleid,pickupdate, dropoffdate)
      
      if(availability.available){
        const result = await bookingRepository.createBooking({
          vehicleid,
          vehiclename,
          pickupdate,
          pickuplocation,
          dropoffdate,
          dropofflocation,
          totalamount,
          username,
          userid,
          paymentstatus,
        });

        return {
          success: true,
          message: 'Booking created successfully',
          booking: result.rows[0],
        };
      }
  

      return {success:false ,message:'Booking not available on selected dates '}

      // Return the created booking
    } catch (err) {
      console.error('Error creating booking:', err);
      throw new Error('Failed to create booking: ' + err.message);
    }
  },

  // Update an existing booking by ID
  async updateBooking({ id, vehicleid, vehiclename, pickupdate, pickuplocation, dropoffdate, dropofflocation, totalamount, username, userid, paymentstatus }) {
    // Validate booking input
    const { error } = bookingRequest.validateUpdateBooking({ id, vehicleid, vehiclename, pickupdate, pickuplocation, dropoffdate, dropofflocation, totalamount, username, userid, paymentstatus });
    if (error) {
      throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    try {
      const result = await bookingRepository.updateBooking({
        id,
        vehicleid,
        vehiclename,
        pickupdate,
        pickuplocation,
        dropoffdate,
        dropofflocation,
        totalamount,
        username,
        userid,
        paymentstatus,
      });

      if (result.rows.length > 0) {
        return result.rows[0]; // Return the updated booking
      } else {
        throw new Error('Booking not found');
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      throw new Error('Failed to update booking');
    }
  },

  // Delete a booking by ID
  async deleteBooking(id) {
    try {
      const result = await bookingRepository.deleteBookingById(id);
      if (result.rows.length > 0) {
        return result.rows[0]; 
      } else {
        throw new Error('Booking not found');
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      throw new Error('Failed to delete booking');
    }
  },
};

export default bookingController;
