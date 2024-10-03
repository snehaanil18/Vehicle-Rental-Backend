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
        .required(),
    otherimages: Joi.array()
        .items(Joi.string().uri())
        .optional(),
    model: Joi.string()
        .max(50)
        .optional()
        .allow(''),
    manufacturer: Joi.string()
        .max(50)
        .optional()
        .allow(''),
    vehicletype: Joi.string()
        .valid('SUV', 'Sedan', 'Truck', 'Coupe', 'Hatchback', 'Convertible', 'Wagon', 'suv', 'sedan', 'truck', 'coupe', 'hatchback', 'convertible', 'wagon') // Add lowercase options here
        .required(),
    quantity: Joi.number() 
        .integer()
        .min(1)
        .required(),
    transmission: Joi.string()
        .valid('MANUAL', 'AUTOMATIC','manual', 'automatic') 
        .required(),
    fueltype: Joi.string()
        .valid('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC','petrol', 'diesal', 'hybrid', 'electric')  // Add valid fuel types
        .required(),
});

// Define Joi validation schema for updating a vehicle
const updateVehicleSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .optional(),
    description: Joi.string()
        .max(255)
        .optional()
        .allow(''),
    price: Joi.number()
        .positive()
        .optional(),
    primaryimage: Joi.string()
        .uri() 
        .optional(),
    otherimages: Joi.array()
        .items(Joi.string().uri()) 
        .optional(),
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
        .valid('MANUAL', 'AUTOMATIC')  // Add valid transmission options
        .optional(),
    fueltype: Joi.string()
        .valid('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC')  // Add valid fuel types
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
