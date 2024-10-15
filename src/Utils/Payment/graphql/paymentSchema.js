import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './typeDef/paymentTypeDef.js'
import paymentResolver from './resolver/paymentResolver.js'

const paymentSchema = makeExecutableSchema({
    typeDefs,
    resolvers: [paymentResolver]
})

export default paymentSchema;