import detailsController from "./detailsController.js";

const detailsResolvers = {
    Query: {
        getAllManufacturers: async () => {
            return await detailsController.getAllManufacturers();
        },
        getModelsByManufacturer: async (_, { manufacturerId }) => {
            return await detailsController.getModelsByManufacturer(manufacturerId);
        },
    },
}

export default detailsResolvers;