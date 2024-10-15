import typesenseClient from "./typesense.js";

const createTypesenseCollection = async () => {
    try {
      await typesenseClient.collections().create({
        name: 'vehicles',
        fields: [
          { name: 'id', type: 'string' },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'price', type: 'float' },
          { name: 'primaryimage', type: 'string' },
          { name: 'model', type: 'string' },
          { name: 'manufacturer', type: 'string' },
          { name: 'vehicletype', type: 'string' },
          { name: 'quantity', type: 'int32' },
          { name: 'transmission', type: 'string' },
          { name: 'fueltype', type: 'string' },
        ],
        default_sorting_field: 'price',
      });
      console.log('Vehicles collection created in Typesense');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('Collection already exists');
      } else {
        console.error('Error creating collection:', err);
      }
    }
  };
  
  // Execute the function when the file is run
export default createTypesenseCollection;
  