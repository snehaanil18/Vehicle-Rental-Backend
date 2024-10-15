import { gql } from 'apollo-server-express'
import detailsTypeDef from './Models/manufacturer.js'
import detailQueries from './queries/detailQueries.js'
import detailsMutations from './mutations/detailMutations.js'

const typeDefs = gql`
    ${detailsTypeDef}
    ${detailQueries}
    ${detailsMutations}
`;

export default typeDefs;