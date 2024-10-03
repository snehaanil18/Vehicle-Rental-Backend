import { gql } from 'apollo-server-express'
import vehicletypeDef from './Models/vehicle.js'
import vehicleQueries from './queries/vehicleQueries.js'
import vehicleMutations from './mutations/vehicleMutations.js'

const typeDefs = gql`
    ${vehicletypeDef}
    ${vehicleQueries}
    ${vehicleMutations}
`;

export default typeDefs;