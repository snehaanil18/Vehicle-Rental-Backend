import { gql } from 'apollo-server-express'

const vehicleMutations = gql`
scalar Upload
    type Mutation{
        addVehicle(
            name: String!
            description: String
            price: Float!
            primaryimage: Upload!
            otherimages: [Upload]!
            model: String!
            manufacturer: String!
            vehicletype: String!
            quantity: Int!
            transmission: String,
            fueltype: String   
        ): Vehicle

        updateVehicle(
            id: ID!
            name: String
            description: String
            price: Float
            primaryimage: String
            otherimages: [String]
            model: String
            manufacturer: String
            vehicletype: String!
            quantity: Int!
            transmission: String
            fueltype: String   
        ): Vehicle

        deleteVehicle(id: ID!): Boolean
    }

    type VehicleResponse {
        success: Boolean!
        message: String!
        vehicle: Vehicle 
    }
`;

export default vehicleMutations;