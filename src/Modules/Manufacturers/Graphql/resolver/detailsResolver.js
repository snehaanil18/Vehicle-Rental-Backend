import detailsController from "../../Controller/detailsController.js";

const detailsResolvers = {
    Query: {
        getAllManufacturers: async () => {
            return await detailsController.getAllManufacturers();
        },
        getModelsByManufacturer: async (_, { manufacturerid }) => {
            return await detailsController.getModelsByManufacturer(manufacturerid);
        },
        getAllModels: async () => {
            return await detailsController.getAllModels();
        }
    },
    Mutation: {
        addManufacturer: async (_, { name }) => {
            return await detailsController.addManufacturer(name);
        },

        addModel: async (_, { name, year, manufacturerid }) => {
            return await detailsController.addModel(name, year, manufacturerid);
        },
    },
}

export default detailsResolvers;