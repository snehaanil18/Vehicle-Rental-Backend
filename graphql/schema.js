import {mergeSchemas} from '@graphql-tools/schema'
import userSchema from '../src/Modules/User/Graphql/userSchema.js'
import vehicleSchema from '../src/Modules/Vehicle/Graphql/vehicleSchema.js'
import singleImageSchema from '../Config/ImageUpload/singleImage/singleImageSchema.js'
import multipleImageSchema from '../Config/ImageUpload/MultipleImage/multipleSchema.js'
import detailsSchema from '../src/Utils/Manufacturers/detailSchema.js'

const schema = mergeSchemas({
    schemas: [userSchema, vehicleSchema, singleImageSchema, multipleImageSchema, detailsSchema],
  })

export default schema;