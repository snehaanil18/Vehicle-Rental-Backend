import bcrypt from 'bcrypt';
import userRequest from '../Request/userRequest.js';
import userRepository from '../Repository/userRepository.js';

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

      // Call the repository to create a new user with additional fields
      const result = await userRepository.createUser({ name, email, hashedPassword, phone, city, state, country, pincode });

      // Return the created user data
      return result.rows[0];
    } catch (err) {
      console.error('Error creating user:', err);
      throw new Error('Failed to create user');
    }
  },

  // Update an existing user by ID
  async updateUser({ id, name, email, password, phone, city, state, country, pincode }) {
    // Validate user input
    const { error } = userRequest.validateUpdateUser({ id, name, email, password, phone, city, state, country, pincode });
    if (error) {
      throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    try {
      let updatedFields = { name, email, phone, city, state, country, pincode };

      // If password is provided, hash it before updating
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedFields.password = hashedPassword;
      }

      // Call the repository to update the user
      const result = await userRepository.updateUser({ id, ...updatedFields });

      if (result.rows.length > 0) {
        return result.rows[0]; // Return the updated user
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
  }
};

export default userController;
