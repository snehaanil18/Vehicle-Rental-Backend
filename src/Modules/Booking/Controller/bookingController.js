import bookingRequest from '../Request/bookingRequest.js';
import bookingRepository from '../Repository/bookingRepository.js';
import vehicleController from '../../Vehicle/Controller/vehicleController.js';
import userController from '../../User/Controllers/userController.js';
import vehicleRepository from '../../Vehicle/Repository/vehicleRepository.js';
import notificationController from '../../../Utils/Notifications/Controller/notificationController.js'; 
import WebSocket from 'ws';

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
      const bookings = result.rows; 
      const paidBookings = bookings.filter(booking => 
        booking.paymentstatus == 'Paid'
      )
      return paidBookings
    } catch (err) {
      console.error(`Error fetching bookings for user with id ${userId}:`, err);
      throw new Error('Failed to fetch user bookings');
    }
  },

  // Create a new booking
  async createBooking({ vehicleid, vehiclename, pickupdate, pickuplocation, dropoffdate, dropofflocation, totalamount, username, userid, paymentstatus,userId },io) {
  const userDetails = await userController.getUserById(userId)
    if(userid==null){
      userid=userDetails.id
      username=userDetails.name

    }
    
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
        const formattedDate = new Date(pickupdate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
      });
        await notificationController.createNotification(userid,`Your booking for ${vehiclename} from ${pickuplocation} on ${formattedDate} has been made.`)

        io.emit('notification', {
          message: `Your booking for ${vehiclename} from ${pickuplocation} on ${formattedDate} has been successfully created.`,
          bookingDetails: result.rows[0]
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

  cancelBooking: async ({ bookingId, userId },io) => {
    try{
      const bookingDetails = await bookingRepository.getBookingById(bookingId);
      
      const booking = bookingDetails.rows[0]

      if (!booking) {
        return {
          success: false,
          message: "Booking not Found"
        }
      }

      

      if (booking.userid !== userId) {
        return {
          success: false,
          message: "Booking cancellation not authorized"
        }
      }

      if(booking.paymentstatus == 'Cancelled'){
        return {
          success: false,
          message: "Booking already Cancelled"
        }
      }

    const currentDate = new Date();
    const pickupDate = new Date(booking.pickupdate);

    currentDate.setHours(0, 0, 0, 0);
    pickupDate.setHours(0, 0, 0, 0);
      if (pickupDate <= currentDate) {
        return {
          success: false,
          message: "Cannot cancel booking as the pickup date has already passed."
        };
      }

      await bookingRepository.updatePaymentStatus(bookingId, 'Cancelled');
      await vehicleRepository.updateVehicleAvailabilityAfterCancel(booking.vehicleid, booking.pickupdate, booking.dropoffdate);
      const formattedDate = new Date(pickupDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
      await notificationController.createNotification(userId,`Your booking for ${booking.vehiclename} for ${formattedDate} has been cancelled.`);
      const notificationMessage = `Your booking for ${booking.vehiclename} for ${formattedDate} has been cancelled.`;

       // Emit the notification event for real-time updates

    io.emit('notification', { message: notificationMessage });

    console.log(`Notification sent to user ${userId}: ${notificationMessage}`);

      return {
        success: true,
        message: 'Booking cancelled successfully',
      };
    }
    catch (error) {
      console.error('Error canceling booking:', error);
      throw new Error('Failed to cancel booking');
    }
  }
};

export default bookingController;
