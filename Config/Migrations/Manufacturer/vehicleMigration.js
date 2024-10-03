import pool from '../../DB/db.js';

const vehicleMigrations = async () => {
    const createManufacturersTable = `
      CREATE TABLE IF NOT EXISTS manufacturers (
       id UUID PRIMARY KEY,
       name VARCHAR(100) UNIQUE
      );
    `;

    const createModelsTable = `
      CREATE TABLE IF NOT EXISTS models (
       id UUID PRIMARY KEY,
       manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE CASCADE,
       name VARCHAR(100),
       year INT,
       UNIQUE (name, year)  -- Add a unique constraint on the combination of name and manufacturer_id
      );
    `;

    try {
      await pool.query(createManufacturersTable);

      await pool.query(createModelsTable);
    } catch (error) {
      console.error('Migration failed:', error);
    }
};

export default vehicleMigrations;