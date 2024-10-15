import detailsRepository from "../Repository/detailsRepository.js";

const detailsController = {
    getAllManufacturers: async () => {
        return await detailsRepository.getAllManufacturers();
    },

    getModelsByManufacturer: async (manufacturerid) => {
        return await detailsRepository.getModelsByManufacturer(manufacturerid);
    },

    addManufacturer: async (name) => {
        return await detailsRepository.addManufacturer(name);
    },

    getAllModels: async() => {
        return await detailsRepository.getAllModels();
    },

    addModel: async (name, year, manufacturerid) => {
        if (!name || !year || !manufacturerid) {
            throw new Error("Model name, year, and manufacturer ID are required");
        }

        return await detailsRepository.addModel(name, year, manufacturerid);
    }
};

export default detailsController;