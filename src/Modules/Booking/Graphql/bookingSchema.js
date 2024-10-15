import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './typeDef/index.js'
import bookingResolver from './resolver/bookingResolver.js'

const bookingSchema = makeExecutableSchema({
    typeDefs,
    resolvers: [bookingResolver],
});

export default bookingSchema;