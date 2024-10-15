import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './typeDef/index.js'
import detailsResolvers from './resolver/detailsResolver.js'

const detailsSchema = makeExecutableSchema({
    typeDefs,
    resolvers: [detailsResolvers]
})

export default detailsSchema;