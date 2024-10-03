import vehicleController from "../../Controller/vehicleController.js";
import uploadResolvers from '../../../../../Config/ImageUpload/MultipleImage/Resolver/multipleImageResolver.js'

const vehicleResolvers = {
    Query: {
        getAllVehicles: async () => {
            return await vehicleController.getAllVehicles();
        },
        getVehicle: async (_, { id }) => {
            return await vehicleController.getVehicleById(id);
        },
    },
    Mutation: {
        addVehicle: async (_, { primaryimage, otherimages, ...vehicleData }) => {
            try {
              
              // Upload the primary image (since it's a single file, we wrap it in an array)
              const primaryimageUrl = await uploadResolvers.Mutation.uploadFiles(_, { files: [primaryimage] });
              
              // Upload the other images
              const otherImageUrls = await uploadResolvers.Mutation.uploadFiles(_, { files: otherimages });
      
              // Add the uploaded image URLs to the vehicle data
              const vehicleInput = {
                ...vehicleData,
                primaryimage: primaryimageUrl[0], // primaryimageUrl is an array, take the first element
                otherimages: otherImageUrls,
              };
              
              // Pass the complete vehicle data to the vehicle controller
              return await vehicleController.createVehicle(vehicleInput);
            } catch (err) {
              console.error('Error adding vehicle:', err.message);
              throw new Error('Error adding vehicle: ' + err.message);
            }
          },
        updateVehicle: async (_, { id, ...args }) => {
            return await vehicleController.updateVehicle(id, args);
        },
        deleteVehicle: async (_, { id }) => {
            return await vehicleController.deleteVehicle(id);
        },
    }
};

export default vehicleResolvers;