import vehicleController from "../../Controller/vehicleController.js";
import uploadResolvers from '../../../../../Config/ImageUpload/MultipleImage/Resolver/multipleImageResolver.js'
import { ApolloError } from "apollo-server-express";
import typesenseClient from "../../../../../Config/Typesense/typesense.js";

const vehicleResolvers = {
  Query: {
    // Fetch all vehicles
    getAllVehicles: async () => {
      return await vehicleController.getAllVehicles();
    },

    // Fetch a single vehicle by ID
    getVehicle: async (_, { id }) => {
      return await vehicleController.getVehicleById(id);
    },

    //Search vehicle in typesense collection
    searchVehicles: async (_, { query }) => {
      try {
        const searchResults = await typesenseClient.collections('vehicles').documents().search({
          q: query,
          query_by: 'name',
          sort_by: 'price:asc'
        });
        return searchResults.hits.map(hit => hit.document);
      } catch (error) {
        throw new ApolloError('Failed to search vehicles', error.message);
      }
    },

    //get vehicles in a given price range
    searchVehiclesByPriceRange: async (_, { minPrice, maxPrice }) => {
      const searchParameters = {
        q: '*',
        query_by: 'name,description',
        filter_by: `price:>=${parseFloat(minPrice)} && price:<=${parseFloat(maxPrice)}`,
        sort_by: 'price:asc',
      };

      try {
        const response = await typesenseClient.collections('vehicles').documents().search(searchParameters);
        console.log(response.hits);
        
        return response.hits.map(hit => hit.document); // Return the vehicle docume
      } catch (error) {
        console.error('Error searching vehicles:', error);
        throw new Error('Failed to search vehicles'); 
      }
    },

    //check vehicle availability
    getVehicleAvailability: async (parent, args) => {

      const { vehicleId, pickupdate, dropoffdate } = args;
      try {
        const availability = await vehicleController.checkVehicleAvailability(vehicleId, pickupdate, dropoffdate);
        return availability;
      } catch (error) {
        throw new ApolloError('Failed to check vehicle availability', error.message);
      }
    }


  },
  Mutation: {
    //add vehicle 
    addVehicle: async (_, args) => {

      const {
        images,
        primaryimageindex,
        name,
        description,
        price,
        model,
        manufacturer,
        vehicletype,
        transmission,
        fueltype,
        quantity,
      } = args;





      try {
        // Separate the primary image and other images based on the primaryimageindex
        const primaryImage = images[primaryimageindex];
        // Filter out the primary image from other images
        const otherImages = images

        // Upload the primary image
        const primaryImageUrl = await uploadResolvers.Mutation.uploadFiles(_, { files: [primaryImage] });

        // Upload the other images
        const otherImageUrls = await uploadResolvers.Mutation.uploadFiles(_, { files: otherImages });

        // Construct the vehicle input with the uploaded image URLs
        const vehicleInput = {
          name,
          description,
          price,
          model,
          manufacturer,
          vehicletype,
          transmission,
          fueltype,
          quantity,
          primaryimageindex,
          primaryimage: primaryImageUrl[0],
          otherimages: otherImageUrls,
        };



        // Pass the complete vehicle data to the vehicle controller
        return await vehicleController.createVehicle(vehicleInput);
      } catch (err) {
        console.error('Error adding vehicle:', err.message);
        throw new Error('Error adding vehicle: ' + err.message);
      }
    },

    //update a vehicle
    updateVehicle: async (_, { id, ...args }) => {
      return await vehicleController.updateVehicle(id, args);
    },

    //delete a vehicle
    deleteVehicle: async (_, { id }) => {
      return await vehicleController.deleteVehicle(id);
    },

    //update vehicle images
    updateVehicleImages: async (_, { id, images }) => {


      try {
        let primaryImageUrl;
        let otherImageUrls = [];

        // Check if the first element in the images array is a file or a string
        const primaryImage = images[0];

        // Handle primary image
        if (primaryImage.file) {
          // Resolve the promise to get the file stream
          const fileStream = await primaryImage.file;
          // Upload primary image if it's a file
          primaryImageUrl = await uploadResolvers.Mutation.uploadFiles(_, { files: [fileStream] });
          // Get the URL from the uploaded file
          primaryImageUrl = primaryImageUrl[0];
        } else if (typeof primaryImage.url === 'string') {
          primaryImageUrl = primaryImage.url;
        }

        // Process other images
        for (let i = 1; i < images.length; i++) {
          const image = images[i];
          if (image.file) {
            // Resolve the promise to get the file stream
            const fileStream = await image.file;
            // Upload each file and push its URL to otherImageUrls array
            const uploadResult = await uploadResolvers.Mutation.uploadFiles(_, { files: [fileStream] });
            // Get the URL from the uploaded file
            otherImageUrls.push(uploadResult[0]);
          } else if (typeof image.url === 'string') {
            otherImageUrls.push(image.url);
          }
        }

        // Update the vehicle images in the vehicle controller
        const updateImageData = {

          otherimages: [primaryImageUrl, ...otherImageUrls],
          primaryimageindex: 0,
        };

        return await vehicleController.updateVehicleImages(id, updateImageData);
      } catch (err) {
        console.error('Error updating vehicle images:', err.message);
        throw new Error('Error updating vehicle images: ' + err.message);
      }
    },

  }
};

export default vehicleResolvers;