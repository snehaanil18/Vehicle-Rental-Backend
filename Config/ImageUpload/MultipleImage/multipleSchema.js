import { makeExecutableSchema } from '@graphql-tools/schema'
import typeDefs from './TypeDef/multipleImageTypeDef.js'
import imageResolvers from './Resolver/multipleImageResolver.js'

const multipleImageSchema = makeExecutableSchema({
    typeDefs,
    resolvers: [imageResolvers],
});

export default multipleImageSchema;