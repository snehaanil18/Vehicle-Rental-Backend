import pool from '../../../../Config/DB/db.js';
import { v4 as uuidv4 } from 'uuid';

const userRepository = {
  // Create a new user in the database
  async createUser({ name, email, hashedPassword, phone, city, state, country, pincode }) {
    return await pool.query(
      'INSERT INTO users (id, name, email, password, phone, city, state, country, pincode) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [uuidv4(), name, email, hashedPassword, phone, city, state, country, pincode]
    );
  },

  // Get all users from the database
  async getAllUsers() {
    return await pool.query('SELECT * FROM users');
  },

  // Get a user by ID from the database
  async getUserById(id) {
    return await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  },

  // Update an existing user in the database
  async updateUser({ id, name, email, password, phone, city, state, country, pincode }) {
    return await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3, phone = $4, city = $5, state = $6, country = $7, pincode = $8 WHERE id = $9 RETURNING *',
      [name, email, password, phone, city, state, country, pincode, id]
    );
  },

  // Delete a user from the database using ID
  async deleteUserById(id) {
    return await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  }
};

export default userRepository;
