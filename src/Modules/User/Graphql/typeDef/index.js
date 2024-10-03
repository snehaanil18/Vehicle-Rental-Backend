import { gql } from 'apollo-server-express'
import userTypeDef from './Models/user.js'
import userQueries from './queries/userQueries.js'
import userMutations from './mutations/userMutations.js'

const typeDefs = gql`
  ${userTypeDef}
  ${userQueries}
  ${userMutations}
`;

export default typeDefs;