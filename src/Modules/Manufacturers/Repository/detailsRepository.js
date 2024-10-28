import pool from '../../../../Config/DB/db.js';

const detailsRepository = {
    //get details of all manufacturers
    getAllManufacturers: async () => {
        const query = `SELECT * FROM manufacturers;`;
        const result = await pool.query(query);
        return result.rows; // returns an array of manufacturer objects
    },

    //get details of all models by a manufacturer
    getModelsByManufacturer: async (manufacturerid) => {
        const query = `SELECT * FROM models WHERE manufacturerid = $1;`;
        const result = await pool.query(query, [manufacturerid]);
        return result.rows; // returns an array of model objects
    },

    //add a manufacturer
    addManufacturer: async (name) => {
        const query = `INSERT INTO manufacturers (name) VALUES ($1) RETURNING *;`;
        const result = await pool.query(query, [name]);

        
        return result.rows[0]; // returns the newly created manufacturer object
    },

    //get details of all models
    getAllModels: async () => {
        const query = `SELECT * FROM models;`;
        const result = await pool.query(query);
        return result.rows;
    },

    //add a model
    addModel: async (name, year, manufacturerId) => {
        const query = `INSERT INTO models (name, year, manufacturerid) VALUES ($1, $2, $3) RETURNING *;`;
        const result = await pool.query(query, [name, year, manufacturerId]);

        
        return result.rows[0]; // returns the newly created model object
    }
};

export default detailsRepository;
