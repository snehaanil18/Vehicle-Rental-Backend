import detailsRepository from "../Repository/detailsRepository.js";

const detailsController = {
    //get details of all manufacturers
    getAllManufacturers: async () => {
        return await detailsRepository.getAllManufacturers();
    },

    //get details of all models by a manufacturer
    getModelsByManufacturer: async (manufacturerid) => {
        return await detailsRepository.getModelsByManufacturer(manufacturerid);
    },

    //add a manufacturer
    addManufacturer: async (name) => {
        return await detailsRepository.addManufacturer(name);
    },

    //get details of all models
    getAllModels: async() => {
        return await detailsRepository.getAllModels();
    },

    //add a model
    addModel: async (name, year, manufacturerid) => {
        if (!name || !year || !manufacturerid) {
            throw new Error("Model name, year, and manufacturer ID are required");
        }

        return await detailsRepository.addModel(name, year, manufacturerid);
    }
};

export default detailsController;