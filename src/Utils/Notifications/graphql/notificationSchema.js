import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './typeDef/notificationTypeDef.js'
import notificationResolvers from './resolvers/notificationResolver.js'

const notificationSchema = makeExecutableSchema({
    typeDefs,
    resolvers: [notificationResolvers]
})

export default notificationSchema;