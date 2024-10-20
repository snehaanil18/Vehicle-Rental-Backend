import bcrypt from 'bcrypt';
import userRequest from '../Request/userRequest.js';
import userRepository from '../Repository/userRepository.js';
import { AuthenticationError } from 'apollo-server-express';
import phoneResolver from '../../../Utils/Twilio/graphql/resolver/phoneResolver.js';
// import redisClient from '../../../../Config/Redis/redisClient.js';

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
  async getUserById(id) {
    try {
      const result = await userRepository.getUserById(id);
      // Check if user exists
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      console.error(`Error fetching user with id ${id}:`, err);
      throw new Error('Failed to fetch user');
    }
  },

  // Create a new user
  async createUser({ name, email, password, phone, city, state, country, pincode }) {
    // Validate user input
    const { error } = userRequest.validateCreateUser({ name, email, password, phone, city, state, country, pincode });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('1',phone);
        
        const sendOTP = await phoneResolver.Mutation.sendOTP(null, { phone });
        console.log(sendOTP);

        

        // Call the repository to create a new user with additional fields
        // const result = await userRepository.createUser({ name, email, hashedPassword, phone, city, state, country, pincode });

        // Return the created user data
        return result.rows[0];
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
        throw new AuthenticationError('User not found.');
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new AuthenticationError('Incorrect password.');
      }

      // Exclude password from user details
      
      return user; // Return user details
    } catch (err) {
      console.error('Error logging in user:', err);
      throw new Error('Failed to log in user');
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
  }
};

export default userController;
