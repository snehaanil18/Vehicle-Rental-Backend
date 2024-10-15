import Joi from 'joi';

// Define Joi validation schema for creating a vehicle
const vehicleSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required(),
    description: Joi.string()
        .optional()
        .allow(''),
    price: Joi.number()
        .positive()
        .required(),
    primaryimage: Joi.string()
        .uri()
        .optional(),
    otherimages: Joi.array()
        .items(Joi.string().uri())
        .optional()
        .min(0),   
    primaryimageindex: Joi.number()
        .integer()
        .min(0) 
        .required(),   
    model: Joi.string()
        .max(50)
        .optional()
        .allow(''),
    manufacturer: Joi.string()
        .max(50)
        .optional()
        .allow(''),
    vehicletype: Joi.string()
        .valid('SUV', 'Sedan', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Wagon', 
               'suv', 'sedan', 'truck', 'coupe', 'hatchback', 'convertible', 'wagon') // Include lowercase options
        .required(),
    quantity: Joi.number()
        .integer()
        .min(1)
        .required(),
    transmission: Joi.string()
        .valid('MANUAL', 'AUTOMATIC', 'Manual', 'Automatic') // Include variations
        .required(),
    fueltype: Joi.string()
        .valid('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC', 
               'Petrol', 'Diesel', 'Hybrid', 'Electric') // Include variations
        .required(),
});

// Define Joi validation schema for updating a vehicle
const updateVehicleSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .optional(),
    description: Joi.string()
        
        .optional()
        .allow(''),
    price: Joi.number()
        .positive()
        .precision(2)
        .optional(),
    primaryimage: Joi.string()
        .uri()
        .optional(),
    otherimages: Joi.array()
        .items(Joi.string().uri())
        .optional()
        .min(0), // Allow an empty array
    primaryimageindex: Joi.number() // Include primaryimageindex for update validation
        .integer()
        .min(0) 
        .optional(), // Make it optional for updates
    model: Joi.string()
        .max(50)
        .optional()
        .allow(''),
    manufacturer: Joi.string()
        .max(50)
        .optional()
        .allow(''),
    vehicletype: Joi.string()
        .valid('SUV', 'Sedan', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Wagon')
        .optional(),
    quantity: Joi.number()
        .integer()
        .min(1)
        .optional(),
    transmission: Joi.string()
        .valid('MANUAL', 'AUTOMATIC')
        .optional(),
    fueltype: Joi.string()
        .valid('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC')
        .optional(),
});

// Function to validate vehicle data for creation
const validateVehicle = (vehicleData) => {
    const { error, value } = vehicleSchema.validate(vehicleData, { abortEarly: false });
    return { error, value };
};

// Function to validate vehicle data for updating
const validateUpdateVehicle = (updateData) => {
    const { error, value } = updateVehicleSchema.validate(updateData, { abortEarly: false });
    return { error, value };
};

export default {
    validateVehicle,
    validateUpdateVehicle,
};
