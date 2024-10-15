import bookingController from '../../Controller/bookingController.js';

const bookingResolver = {
  Query: {
    // Fetch all bookings
    getAllBookings: async () => {
      return await bookingController.getAllBookings();
    },

    // Fetch a single booking by ID
    getBooking: async (parent, { id }) => {
      return await bookingController.getBookingById(id);
    },

    // Fetch bookings by user ID
    getBookingsByUser: async (parent, { userId }) => {
      return await bookingController.getBookingsByUser(userId);
    },
  },

  Mutation: {
    // Create a new booking
    createBooking: async (
      parent,
      { vehicleid, vehiclename, pickupdate, pickuplocation, dropoffdate, dropofflocation, totalamount, username, userid, paymentstatus }
    ) => {
      return await bookingController.createBooking({
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
    },
  },
};

export default bookingResolver;
