import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './detailsTypeDefs.js'
import detailsResolvers from './detailsResolver.js'

const detailsSchema = makeExecutableSchema({
    typeDefs,
    resolvers: [detailsResolvers]
})

export default detailsSchema;