import { gql } from 'apollo-server-express'

const vehicletypeDef = gql`

enum Transmission {
        MANUAL
        AUTOMATIC
        Manual
        Automatic
}

enum FuelType {
        DIESEL
        PETROL
        ELECTRIC
        HYBRID
        CNG        
        LPG        
        BIOFUEL 
        Diesel
        Petrol
        Electric
        Hybrid
        cng
}

input VehicleInput {
    name: String!
    description: String
    price: Float!
    model: String!
    manufacturer: String!
    vehicletype: String!
    transmission: Transmission!
    fueltype: FuelType!
    images: [Upload]!
    primaryimageindex: Int!
    quantity: Int!
}

type Vehicle {
        id: ID!
        name: String
        description: String
        price: Float!
        primaryimage: String
        otherimages: [String]
        model: String
        manufacturer: String
        vehicletype: String!
        quantity: Int!
        transmission: Transmission!
        fueltype: FuelType!
        primaryimageindex: Int!
        images: [Image]
}

type Image {
        id: ID!
        vehicleId: ID!  
        url: String!
}

type VehicleAvailabilityResponse {
  available: Boolean
  message: String
}

type VehicleAvailability {
  vehicleId: ID!
  date: String!
  availableQuantity: Int!
}
`;



export default vehicletypeDef;