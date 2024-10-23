import vehicleRepository from "../Repository/vehicleRepository.js";
import vehicleRequest from '../Request/vehicleRequest.js'
import typesenseClient from '../../../../Config/Typesense/typesense.js'
import dotenv from 'dotenv';
dotenv.config();

const vehicleController = {
    // Fetch all vehicles
    async getAllVehicles() {
        try {
            const vehicleData = await vehicleRepository.getAllVehicles();
            const vehicles = vehicleData.rows;


            const vehiclesWithImages = await Promise.all(vehicles.map(async (vehicle) => {
                const images = await vehicleRepository.getImagesByVehicleId(vehicle.id);

                // Separate primary image and other images
                const primaryimage = images.find(image => image.isprimary);
                const otherimages = images.filter(image => !image.isprimary);

                return {
                    ...vehicle,
                    primaryimage: primaryimage ? primaryimage.url : null,
                    otherimages: otherimages.map(image => image.url),
                };
            }));

            return vehiclesWithImages; // Return vehicles with images
        } catch (err) {
            console.error('Error fetching vehicles:', err);
            throw new Error('Failed to fetch vehicles');
        }
    },

    // Fetch a single vehicle by ID
    async getVehicleById(id) {
        try {
            const result = await vehicleRepository.getVehicleById(id);
            if (result.rows.length > 0) {
                const vehicle = result.rows[0];
                const images = await vehicleRepository.getImagesByVehicleId(vehicle.id);

                // Separate primary image and other images
                const primaryimage = images.find(image => image.isprimary);
                const otherimages = images.filter(image => !image.isprimary);

                return {
                    ...vehicle,
                    primaryimage: primaryimage ? primaryimage.url : null,
                    otherimages: otherimages.map(image => image.url),
                };
            } else {
                throw new Error('Vehicle not found');
            }
        } catch (err) {
            console.error(`Error fetching vehicle with id ${id}:`, err);
            throw new Error('Failed to fetch vehicle');
        }
    },

    // Create a new vehicle
    async createVehicle(args) {

        // Validate the input
        const { error } = vehicleRequest.validateVehicle(args);
        if (error) {
            throw new Error(`Validation error: ${error.details.map(err => err.message).join(', ')}`);
        }

        try {
            // Create the vehicle entry in the database
            const result = await vehicleRepository.createVehicle(args);
            const createdVehicle = result.rows[0];

            // Store images in a separate table
            const imagesData = args.otherimages.map((url, index) => ({
                vehicleId: createdVehicle.id,
                // Use primaryimageindex to mark the primary image
                isPrimary: index === args.primaryimageindex,
                url
            }));

            // Insert images into the database
            await Promise.all(imagesData.map(image => {
                return vehicleRepository.addImage(image);
            }));

            // Add vehicle to Typesense
            await typesenseClient.collections('vehicles').documents().create({
                id: createdVehicle.id,
                name: createdVehicle.name,
                description: createdVehicle.description,
                price: parseFloat(createdVehicle.price),
                primaryimage: imagesData.find(img => img.isPrimary)?.url || '', 
                otherimages: imagesData.filter(img => !img.isPrimary).map(img => img.url), 
                model: createdVehicle.model,
                manufacturer: createdVehicle.manufacturer,
                vehicletype: createdVehicle.vehicletype,
                quantity: createdVehicle.quantity,
                transmission: createdVehicle.transmission,
                fueltype: createdVehicle.fueltype,
            });

            return createdVehicle;
        } catch (err) {
            console.error('Error creating vehicle:', err);
            throw new Error('Failed to create vehicle');
        }
    },


    // Update an existing vehicle by ID
    async updateVehicle(id, args) {
        const { error } = vehicleRequest.validateUpdateVehicle(args); // Validate the input
        if (error) {
            throw new Error(`Validation error: ${error.details.map(err => err.message).join(', ')}`);
        }
        try {
            const oldVehicleResult = await vehicleRepository.getVehicleById(id); 
            const oldVehicle = oldVehicleResult.rows[0];
            const oldQuantity = oldVehicle.quantity;

            const result = await vehicleRepository.updateVehicle(id, args);
            const updatedVehicle =  result.rows[0];
            const newQuantity = updatedVehicle.quantity;

            await typesenseClient.collections('vehicles').documents().update({
                id: updatedVehicle.id,
                name: updatedVehicle.name,
                description: updatedVehicle.description,
                price: parseFloat(updatedVehicle.price),
                quantity: updatedVehicle.quantity
            });

            const quantityDifference = newQuantity-oldQuantity;
            if (quantityDifference !== 0) {
                await vehicleRepository.updateQuantity(id, quantityDifference);
            }

            const response = {
                success: true,
                message: 'Vehicle updated successfully',
                vehicle: result.rows[0]
            }
            return response; // Return the updated vehicle
        } catch (err) {
            console.log('Error updating vehicle', err);
            throw new Error('Failed to create vehicle');
        }
    },

    // Delete a vehicle by ID
    async deleteVehicle(id) {
        try {
            const result = await vehicleRepository.deleteVehicleById(id);
            if (result.rows.length > 0) {
                return result.rows[0]; // Return the deleted vehicle's data
            } else {
                throw new Error('Vehicle not found');
            }
        } catch (err) {
            console.error('Error deleting vehicle:', err);
            throw new Error('Failed to delete vehicle');
        }
    },

    async checkVehicleAvailability(vehicleId, pickUpDate, dropOffDate) {
        try {
            const availableVehicles = await vehicleRepository.checkAvailability(vehicleId, pickUpDate, dropOffDate);
            if (availableVehicles.length === 0) {
                return {
                    available: true,
                    message: 'Vehicle is available on all required dates'
                };
            }

            let isAvailable = true;
            for (const day of availableVehicles) {
                if (day.availablequantity <= 0) {
                    isAvailable = false;
                    break;
                }
            }

            if (isAvailable) {
                return {
                    available: true,
                    message: 'Vehicle is available on all required dates'
                };
            } else {
                return {
                    available: false,
                    message: 'Vehicle is not available on all required dates'
                };
            }


        } catch (err) {
            console.error('Error checking vehicle availability:', err);
            throw new Error('Failed to check vehicle availability');
        }
    },

    async updateVehicleImages(vehicleId, args) {

        
        try {
            // Delete all existing images for the vehicle
            await vehicleRepository.deleteImagesByVehicleId(vehicleId);
    
            // Prepare new image data
            const imagesToInsert = args.otherimages.map((url, index) => ({
                vehicleId,
                isPrimary: index === args.primaryimageindex,
                url
            }));

            console.log('img',imagesToInsert,process.env.MINIO_ENDPOINT);
            
            // Insert new images into the database
            await Promise.all(imagesToInsert.map(image => {
                return vehicleRepository.addImage(image);
            }));
    
            await typesenseClient.collections('vehicles').documents().update({
                id: vehicleId,
                primaryimage:imagesToInsert.find(img => img.isPrimary)?.url || '',
                otherimages:imagesToInsert.filter(img => !img.isPrimary).map(img => img.url),
            });
            
            
            // Return success message or updated vehicle images
            return { message: 'Images updated successfully' };
        } catch (err) {
            console.error('Error updating vehicle images:', err);
            throw new Error('Failed to update vehicle images');
        }
    }



};

export default vehicleController;