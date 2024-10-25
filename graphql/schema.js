import {mergeSchemas} from '@graphql-tools/schema'
import userSchema from '../src/Modules/User/Graphql/userSchema.js'
import vehicleSchema from '../src/Modules/Vehicle/Graphql/vehicleSchema.js'
import singleImageSchema from '../Config/ImageUpload/singleImage/singleImageSchema.js'
import multipleImageSchema from '../Config/ImageUpload/MultipleImage/multipleSchema.js'
import detailsSchema from '../src/Modules/Manufacturers/Graphql/detailSchema.js'
import bookingSchema from '../src/Modules/Booking/Graphql/bookingSchema.js'
import paymentSchema from '../src/Utils/Payment/graphql/paymentSchema.js'
import phoneSchema from '../src/Utils/Twilio/graphql/phoneSchema.js'
import notificationSchema from '../src/Utils/Notifications/graphql/notificationSchema.js'

const schema = mergeSchemas({
    schemas: [userSchema, vehicleSchema, singleImageSchema, multipleImageSchema, detailsSchema, bookingSchema, paymentSchema, phoneSchema,notificationSchema],
  })

export default schema;