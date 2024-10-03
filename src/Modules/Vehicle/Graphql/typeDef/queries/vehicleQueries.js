import { gql } from 'apollo-server-express'

const vehicleQueries = gql`
    type Query {
        getAllVehicles: [Vehicle]
        getVehicle(id: ID!): Vehicle
    }
`;

export default vehicleQueries;