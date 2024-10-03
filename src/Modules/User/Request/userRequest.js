import Joi from "joi";

// Define Joi validation schema
const userRequest = {
  // Validation for creating a new user
  validateCreateUser(data) {
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      phone: Joi.string().pattern(/^\d{10}$/).required(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      pincode: Joi.string().pattern(/^\d{6}$/).optional()
    });
    
    // Validate input
    return schema.validate(data, { abortEarly: false });
  },

  // Validation for updating a user
  validateUpdateUser(data) {
    const schema = Joi.object({
      id: Joi.string().required(), // ID is required for updates
      name: Joi.string().min(3).optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).optional(),
      phone: Joi.string().pattern(/^\d{10}$/).optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      pincode: Joi.string().pattern(/^\d{6}$/).optional()
    });

    // Validate input
    return schema.validate(data, { abortEarly: false });
  }
};

export default userRequest;
