import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './typeDef/phoneTypeDef.js'
import phoneResolver from './resolver/phoneResolver.js'

const phoneSchema = makeExecutableSchema({
    typeDefs,
    resolvers: [phoneResolver]
})

export default phoneSchema;