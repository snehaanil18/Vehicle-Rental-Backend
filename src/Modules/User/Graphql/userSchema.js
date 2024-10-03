import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './typeDef/index.js'
import userResolver from './resolver/userResolver.js'

const userSchema = makeExecutableSchema({
    typeDefs,
    resolvers: [userResolver],
});

export default userSchema;