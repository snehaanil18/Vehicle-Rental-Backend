import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './typeDef/index.js'
import vehicleResolvers from './resolver/vehicleResolver.js'

const vehicleSchema = makeExecutableSchema({
    typeDefs,
    resolvers: [vehicleResolvers],
})

export default vehicleSchema;