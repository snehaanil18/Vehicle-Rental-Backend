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
  async updateUser({ id, name, email, phone, city, state, country, pincode }) {
    return await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3, city = $4, state = $5, country = $6, pincode = $7 WHERE id = $8 RETURNING *',
      [name, email, phone, city, state, country, pincode, id]
    );
  },

  // Delete a user from the database using ID
  async deleteUserById(id) {
    return await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  },

  // Get a user by email from the database
  async getUserByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows.length > 0 ? result.rows[0] : null; // Return user or null if not found
  },

  async updateUserProfileImage(id, imageUrl) {

    const query = `
      UPDATE users
      SET profileimage = $1
      WHERE id = $2
      RETURNING *;
    `;

    const values = [imageUrl, id];
    const result = await pool.query(query, values);
    return result;
  },

  async setOTP({ userId, otp, otpExpiry }) {

    const otpExpiryInSeconds = Math.floor(otpExpiry / 1000);


    const result = await pool.query(
      `INSERT INTO otp (userid, otp, otpexpiry)
             VALUES ($1, $2,to_timestamp($3))
             RETURNING id, otp, otpexpiry`,
      [userId, otp, otpExpiryInSeconds]
    );
    return result.rows[0];

  },

  async getOTP(id) {
    const user = await pool.query('SELECT * FROM otp WHERE userid = $1', [id])
    return user.rows[0]
  },

  async updatePhoneVerify(userId, phoneVerified) {
    const query = `
    UPDATE users 
    SET phoneverify = $1 
    WHERE id = $2
    RETURNING id, phoneverify;
`;
    const values = [phoneVerified, userId];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async clearOTP(userId) {
    await pool.query('DELETE FROM otp WHERE userid = $1', [userId]);
  }
};

export default userRepository;
