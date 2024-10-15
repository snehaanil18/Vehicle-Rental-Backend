import Joi from 'joi';

// Define the schema for creating a booking
const createBookingSchema = Joi.object({
  vehicleid: Joi.string().required(),
  vehiclename: Joi.string().required(),
  pickupdate: Joi.date().iso().required(), // Ensures the date is in ISO format
  pickuplocation: Joi.string().required(),
  dropoffdate: Joi.date().iso().required(),
  dropofflocation: Joi.string().required(),
  totalamount: Joi.number().positive().required(), // Ensures the amount is a positive number
  username: Joi.string().required(),
  userid: Joi.string().required(),
  paymentstatus: Joi.string().valid('PENDING', 'COMPLETED', 'FAILED','Pending','Completed','Failed').required(), // Ensure payment status is one of the defined values
});

// Define the schema for updating a booking
const updateBookingSchema = Joi.object({
  vehicleid: Joi.string(),
  vehiclename: Joi.string(),
  pickupdate: Joi.date().iso(),
  pickuplocation: Joi.string(),
  dropoffdate: Joi.date().iso(),
  dropofflocation: Joi.string(),
  totalamount: Joi.number().positive(),
  username: Joi.string(),
  userid: Joi.string(),
  paymentstatus: Joi.string().valid('PENDING', 'COMPLETED', 'FAILED'),
}).or('vehicleid', 'vehiclename', 'pickupdate', 'pickuplocation', 'dropoffdate', 'dropofflocation', 'totalamount', 'username', 'userid', 'paymentstatus'); // At least one field must be provided for an update

const bookingRequest = {
  validateCreateBooking: (data) => createBookingSchema.validate(data),
  validateUpdateBooking: (data) => updateBookingSchema.validate(data),
};

export default bookingRequest;
