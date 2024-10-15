import { gql } from 'apollo-server-express';

const vehicleMutations = gql`
scalar Upload

input CombinedImageInput {
    url: String
    file: Upload
}

type Mutation {
    addVehicle(
        name: String!
        description: String
        price: Float!
        images: [Upload]!
        primaryimageindex: Int! 
        model: String!
        manufacturer: String!
        vehicletype: String!
        quantity: Int!
        transmission: String
        fueltype: String
    ): Vehicle

    updateVehicle(
        id: ID!
        name: String
        description: String
        price: Float
        quantity: Int!
    ): VehicleResponse

    updateVehicleImages(
        id: ID!
        images: [CombinedImageInput]!
        primaryimageindex: Int
    ): VehicleImageResponse

    deleteVehicle(id: ID!): Boolean
}

type VehicleResponse {
    success: Boolean
    message: String
    vehicle: Vehicle 
}

type VehicleImageResponse {
    success: Boolean!
    message: String!
    images: [String] 
}
`;

export default vehicleMutations;
