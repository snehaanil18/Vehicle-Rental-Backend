import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './TypeDef/uploadTypeDef.js'
import imageResolvers from './Resolver/uploadResolver.js'

const singleImageSchema = makeExecutableSchema({
    typeDefs,
    resolvers: [imageResolvers],
});

export default singleImageSchema;