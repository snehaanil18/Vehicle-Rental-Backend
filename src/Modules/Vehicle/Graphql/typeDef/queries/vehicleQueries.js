import { gql } from 'apollo-server-express'

const vehicleQueries = gql`
    type Query {
        getAllVehicles: [Vehicle]
        getVehicle(id: ID!): Vehicle
        searchVehicles(query: String!): [Vehicle]
        searchVehiclesByPriceRange(minPrice:  String!, maxPrice:  String!): [Vehicle]
        getImagesByVehicleId(vehicleId: ID!): [Image]
        getVehicleAvailability(vehicleId: ID!, pickupdate: String!, dropoffdate: String!): VehicleAvailabilityResponse
    }
`;

export default vehicleQueries;