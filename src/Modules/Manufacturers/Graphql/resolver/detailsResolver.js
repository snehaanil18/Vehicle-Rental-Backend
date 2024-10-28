import detailsController from "../../Controller/detailsController.js";

const detailsResolvers = {
    Query: {
        //get details of all manufacturers
        getAllManufacturers: async () => {
            return await detailsController.getAllManufacturers();
        },

        //get details of all models by a manufacturer
        getModelsByManufacturer: async (_, { manufacturerid }) => {
            return await detailsController.getModelsByManufacturer(manufacturerid);
        },

        //get details of all models
        getAllModels: async () => {
            return await detailsController.getAllModels();
        }
    },
    Mutation: {
        //add a manufacturer
        addManufacturer: async (_, { name }) => {
            return await detailsController.addManufacturer(name);
        },

        //add a model
        addModel: async (_, { name, year, manufacturerid }) => {
            return await detailsController.addModel(name, year, manufacturerid);
        },
    },
}

export default detailsResolvers;