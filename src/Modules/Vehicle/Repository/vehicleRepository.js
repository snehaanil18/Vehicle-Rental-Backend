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
        const { name, description, price, primaryimage, otherimages, model, manufacturer, vehicletype, quantity, transmission, fueltype } = vehicleData;


        return await pool.query(
            'INSERT INTO vehicles (name, description, price, primaryimage, otherimages, model, manufacturer, vehicletype, quantity, transmission, fueltype ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [name, description, price, primaryimage, otherimages, model, manufacturer, vehicletype, quantity, transmission, fueltype  ]
        );
    },

    // Update an existing vehicle by ID
    async updateVehicle({id, name, description, price, primaryimage, otherimages, model, manufacturer, vehicletype, quantity, transmission, fueltype }) {
        return await pool.query(
            'UPDATE vehicles SET name = $1, description = $2, price = $3, primaryimage = $4, otherimages = $5, model = $6, manufacturer = $7, vehicletype = $8, quantity = $9 , transmission = $10, fueltype = $11 WHERE id = $12 RETURNING *',
            [name, description, price, primaryimage, otherimages, model, manufacturer, vehicletype, quantity , transmission, fueltype, id]
        );
    },

    // Delete a vehicle by ID
    async deleteVehicleById(id) {
        return await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
    }
};

export default vehicleRepository;