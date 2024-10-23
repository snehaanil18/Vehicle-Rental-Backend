import phoneController from '../../Controller/phoneController.js'

const phoneResolver = {
    Mutation : {
        sendOTP : async (_,{ phone }) => {
            return await phoneController.sendOTP(phone);
        },
        verifyOTPf: async (_, { phone, otp }, context) => {
            return await phoneController.verifyOTP(phone, otp, context);
        }
    }
}

export default phoneResolver;