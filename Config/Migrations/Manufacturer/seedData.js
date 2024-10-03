
import pool from '../../DB/db.js';
import { v4 as uuidv4 } from 'uuid';

const seedData = async () => {
    try {
        // Check if any manufacturers exist
        const existingManufacturers = await pool.query('SELECT COUNT(*) FROM manufacturers;');
        
        if (existingManufacturers.rows[0].count > 0) {
            return; // Exit if data already exists
        }

        // Insert manufacturers
        const insertManufacturers = `
          INSERT INTO manufacturers (id, name) VALUES
          ($1, 'Toyota'),
          ($2, 'Honda'),
          ($3, 'Ford');
        `;
        await pool.query(insertManufacturers, [uuidv4(), uuidv4(), uuidv4()]);

        
        // Insert models
        const insertModels = `
          INSERT INTO models (id, manufacturer_id, name, year) VALUES
          ($1, (SELECT id FROM manufacturers WHERE name = 'Toyota'), 'Camry', 2022),
          ($2, (SELECT id FROM manufacturers WHERE name = 'Toyota'), 'Corolla', 2023),
          ($3, (SELECT id FROM manufacturers WHERE name = 'Honda'), 'Civic', 2021),
          ($4, (SELECT id FROM manufacturers WHERE name = 'Honda'), 'Accord', 2022),
          ($5, (SELECT id FROM manufacturers WHERE name = 'Ford'), 'Mustang', 2021);
        `;
        await pool.query(insertModels, [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()]);

    } catch (error) {
        console.error('Seeding failed:', error);
    }
};

export default seedData;