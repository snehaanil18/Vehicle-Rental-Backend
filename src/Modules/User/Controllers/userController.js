// import bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import userRequest from '../Request/userRequest.js';
import userRepository from '../Repository/userRepository.js';
import jwt from 'jsonwebtoken';
import phoneResolver from '../../../Utils/Twilio/graphql/resolver/phoneResolver.js';
import notificationController from '../../../Utils/Notifications/Controller/notificationController.js';
import redis from '../../../../Config/Redis/redisClient.js';

const userController = {
  // Fetch all users
  async getAllUsers() {
    try {
      const result = await userRepository.getAllUsers();
      // Return the fetched users
      return result.rows;
    } catch (err) {
      console.error('Error fetching users:', err);
      throw new Error('Failed to fetch users');
    }
  },

  // Fetch a single user by ID
  async getUserById(userId) {


    try {
      const result = await userRepository.getUserById(userId);
      // Check if user exists
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      console.error(`Error fetching user with id ${userId}:`, err);
      throw new Error('Failed to fetch user');
    }
  },
  // Create a new user
  async createUser({ name, email, password, phone, city, state, country, pincode }, context) {
    // Validate user input
    const { error } = userRequest.validateCreateUser({ name, email, password, phone, city, state, country, pincode });
    if (error) {
      throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    try {
      // Hash the password
      const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);


      const sendOTP = await phoneResolver.Mutation.sendOTP(null, { phone });

      context.req.session.user = { name, email, hashedPassword, phone, city, state, country, pincode };
      context.req.session.otp = sendOTP.detail;

      await redis.setex(`otp:${phone}`, 300, sendOTP.detail.otp);

      // Call the repository to create a new user with additional fields
      const result = await userRepository.createUser({ name, email, hashedPassword, phone, city, state, country, pincode });
      const details = result.rows[0]

      // await userRepository.setOTP({ userId: details.id, otp: sendOTP.detail.otp, otpExpiry: sendOTP.detail.expiry })

      const response = {
        userId: details.id,
        success: true,
        message: 'OTP sent successfully'
      }

      // Return the created user data
      return response
    } catch (err) {
      console.error('Error creating user:', err);

      // Check for unique constraint violation
      if (err.code === '23505') { // Unique violation error code
        if (err.detail.includes('Key (email)')) {
          throw new Error('Email already exists. Please use a different email.');
        } else if (err.detail.includes('Key (phone)')) {
          throw new Error('Phone number already exists. Please use a different phone number.');
        }
      }

      throw new Error('Failed to create user: ' + err.message);
    }
  },


  // Update an existing user by ID
  async updateUser({ id, name, email, phone, city, state, country, pincode }) {
    // Validate user input
    const { error } = userRequest.validateUpdateUser({ id, name, email, phone, city, state, country, pincode });
    if (error) {
      throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    try {
      let updatedFields = { name, email, phone, city, state, country, pincode };



      // Call the repository to update the user
      const result = await userRepository.updateUser({ id, ...updatedFields });

      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      throw new Error('Failed to update user');
    }
  },

  // Delete a user by ID
  async deleteUser(id) {
    try {
      const result = await userRepository.deleteUserById(id);
      // Check if a user was deleted
      if (result.rows.length > 0) {
        return result.rows[0]; // Return the deleted user's data
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      throw new Error('Failed to delete user');
    }
  },

  async loginUser(email, password) {
    try {
      // Fetch user by email
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        return { success: false, message: 'User not found.' };
      }

      // Check if the phone number is verified
      if (!user.phoneverify) {
        return { success: false, message: 'Phone number not verified.' };
      }

      // Compare the password
      const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
      if (hashedPassword !== user.password) {
        return { success: false, message: 'Incorrect password.' };
      }

      const token = jwt.sign(
        { userId: user.id }, // Only include userId in the payload
        process.env.JWT_SECRET // Secret key
      );

      const notifications = await notificationController.viewUserNotifications(user.id)

      return { success: true, token, user, notifications };
    } catch (err) {
      console.error('Error logging in user:', err);
      return { success: false, message: 'Failed to log in user.' };
    }
  },

  async updateUserProfileImage(id, imageUrl) {
    try {
      // Update the user profile image in the repository
      const result = await userRepository.updateUserProfileImage(id, imageUrl);

      if (result.rows.length > 0) {
        const updatedUser = result.rows[0];
        // Exclude the password field from the returned user object
        const { password: _, ...userDetails } = updatedUser;
        return userDetails;
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      console.error('Error updating profile image:', err);
      throw new Error('Failed to update profile image');
    }
  },

  async verifyOTP(id, phone, otp, context) {

    try {
      // Retrieve the OTP details from the repository for the given user ID
      // const otpDetails = await userRepository.getOTP(id);
      const otpDetails = await redis.get(`otp:${phone}`);

      // Check if OTP details exist for the user
      if (!otpDetails) {
        return { success: false, message: 'OTP not found or expired.' };
      }

      // Check if OTP has expired
      // const otpExpiry = new Date(otpDetails.otpexpiry).getTime();  // Ensure otpexpiry is in proper Date format
      // if (Date.now() > otpExpiry) {
      //   await userRepository.deleteUserById(id)
      //   return { success: false, message: 'OTP has expired.' };

      // }

      // Validate the OTP
      if (otp !== otpDetails) {
        return { success: false, message: 'Invalid OTP.' };
      }

      await userRepository.updatePhoneVerify(id, true);
      // await userRepository.clearOTP(id);
      await redis.del(`otp:${phone}`);

      return { success: true, message: 'OTP verified successfully.' };

    } catch (err) {
      console.error('Error verifying OTP:', err);
      return { success: false, message: 'An error occurred while verifying OTP.' };
    }
  }

};

export default userController;
