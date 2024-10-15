import { gql } from 'apollo-server-express'
import bookingQueries from './queries/bookingQueries.js'
import bookingTypeDef from './Models/booking.js'
import bookingMutations from './mutations/bookingMutations.js'

const typeDefs = gql`
    ${bookingTypeDef}
    ${bookingQueries}
    ${bookingMutations}
`;

export default typeDefs;