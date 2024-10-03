import vehicleRepository from "../Repository/vehicleRepository.js";
import vehicleRequest from '../Request/vehicleRequest.js'

const vehicleController = {
    // Fetch all vehicles
    async getAllVehicles() {
        try {
            const result = await vehicleRepository.getAllVehicles();
            return result.rows; // Return the fetched vehicles
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
                return result.rows[0]; // Return the vehicle details
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
        const { error } = vehicleRequest.validateVehicle(args); // Validate the input
        if (error) {
            throw new Error(`Validation error: ${error.details.map(err => err.message).join(', ')}`);
        }
        
        try {
            const result = await vehicleRepository.createVehicle(args );
         
            return result.rows[0]; // Return the created vehicle
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
            const result = await vehicleRepository.updateVehicle(id, args.name, args.description, args.price, args.primaryimage, args.otherimages, args.model, args.manufacturer, args.vehicletype, args.quantity);
            if (result.rows.length > 0) {
                return result.rows[0]; // Return the updated vehicle
            } else {
                throw new Error('Vehicle not found');
            }
        } catch (err) {
            console.error('Error updating vehicle:', err);
            throw new Error('Failed to update vehicle');
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
    }
};

export default vehicleController;