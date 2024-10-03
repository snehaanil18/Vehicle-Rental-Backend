import pool from '../DB/db.js';

const userMigrations = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY, 
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      phone VARCHAR(15),
      city VARCHAR(100),
      state VARCHAR(100),
      country VARCHAR(100),
      pincode VARCHAR(10)
    );
  `;

  try {
    await pool.query(createUsersTable);
    // console.log('Users table created or already exists');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

export default userMigrations;
