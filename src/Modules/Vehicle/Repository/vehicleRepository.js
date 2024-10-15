import pool from '../../../../Config/DB/db.js'

const vehicleRepository = {
  // Fetch all vehicles
  async getAllVehicles() {
    return await pool.query('SELECT * FROM vehicles');
  },

  // Fetch a single vehicle by ID
  async getVehicleById(id) {
    return await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
  },

  // Create a new vehicle
  async createVehicle(vehicleData) {
    const { name, description, price, model, manufacturer, vehicletype, quantity, transmission, fueltype } = vehicleData;

    // Insert vehicle data into vehicles table
    const result = await pool.query(
      'INSERT INTO vehicles (name, description, price, model, manufacturer, vehicletype, quantity, transmission, fueltype) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, description, parseFloat(price), model, manufacturer, vehicletype, quantity, transmission, fueltype]
    );

    return result; // Return the created vehicle
  },
  // Update an existing vehicle by ID
  async updateVehicle(id,args) {
    const{name, description, price, quantity} = args  

      
    const result = await pool.query(
      'UPDATE vehicles SET name = $1, description = $2, price = $3,  quantity = $4  WHERE id = $5 RETURNING *',
      [name, description, price, quantity, id]
    );    
    return result
  },

  // Delete a vehicle by ID
  async deleteVehicleById(id) {
    return await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
  },

  async addImage({ vehicleId, isPrimary, url }) {
    return await pool.query(
      'INSERT INTO images (vehicleId, isPrimary, url) VALUES ($1, $2, $3) RETURNING *',
      [vehicleId, isPrimary, url]
    );
  },

     // Fetch images by vehicle ID
     async getImagesByVehicleId(vehicleId) {
      const query = `
          SELECT * FROM images
          WHERE vehicleId = $1
      `;
      const result = await pool.query(query, [vehicleId]);
      return result.rows;
  },

  // Update an existing image by ID


  async deleteImagesByVehicleId(vehicleId) {
    try {
        const query = `
            DELETE FROM images
            WHERE vehicleid = $1
        `;
        const values = [vehicleId];
        const result = await pool.query(query, values);

        return result.rowCount; // Return the number of deleted rows
    } catch (err) {
        console.error('Error deleting images by vehicleId:', err);
        throw new Error('Failed to delete images');
    }
},

  async checkAvailability(vehicleId, startDate, endDate) {
   
    try {
      const result = await pool.query(
        `SELECT * FROM vehicleavailability 
             WHERE vehicleid = $1 
             AND date BETWEEN $2 AND $3 `,
        [vehicleId, startDate, endDate]
      );


      return result.rows; // Returns the available records
    } catch (err) {
      console.error('Error checking vehicle availability:', err);
      throw new Error('Failed to check vehicle availability');
    }
  },

  async decreaseQuantity(vehicleId, startDate, endDate, quantity) {
    try {
      await pool.query(
        `UPDATE vehicleavailability 
             SET availablequantity = availablequantity - $1 
             WHERE vehicleid = $2 
             AND date BETWEEN $3 AND $4`,
        [quantity, vehicleId, startDate, endDate]
      );
    } catch (err) {
      console.error('Error updating vehicle availability:', err);
      throw new Error('Failed to update vehicle availability');
    }
  },

  updateAvailability: async (availabilityInput) => {
    const { vehicleId, date, quantity } = availabilityInput;


    try {
      const result = await pool.query(
        `UPDATE vehicleavailability 
             SET availablequantity = availablequantity - $1 
             WHERE vehicleid = $2 AND date = $3`,
        [quantity, vehicleId, date]
      );

      // If no rows were updated, it means the date hasn't been inserted yet, so insert it
      if (result.rowCount === 0) {
        await pool.query(
          `INSERT INTO vehicleavailability (vehicleid, date, availablequantity) 
               VALUES ($1, $2, (SELECT quantity FROM vehicles WHERE id = $1) - $3)`,
          [vehicleId, date, quantity]
        );
      }


    } catch (err) {
      throw new Error(`Failed to update vehicle availability: ${err.message}`);
    }
  },



};

export default vehicleRepository;