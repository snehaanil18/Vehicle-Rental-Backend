import pool from '../../../Config/DB/db.js'

const detailsController = {
    getAllManufacturers: async () => {
        const query = `SELECT * FROM manufacturers;`;
        const result = await pool.query(query);
        return result.rows; // returns an array of manufacturer objects
    },

    getModelsByManufacturer: async (manufacturerId) => {
        const query = `
            SELECT * FROM models WHERE manufacturer_id = $1;
        `;
        const result = await pool.query(query, [manufacturerId]);
        return result.rows; // returns an array of model objects
    },
};

export default detailsController;