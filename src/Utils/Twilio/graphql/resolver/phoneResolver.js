import phoneController from '../../Controller/phoneController.js'

const phoneResolver = {
    Mutation : {
        sendOTP : async (_,{ phone }) => {
            console.log('2',phone);
            return await phoneController.sendOTP(phone);
        },
        verifyOTP : async (_, { phone, otp }) => {
            return await phoneController.verifyPhone(phone, otp);
        }
    }
}

export default phoneResolver;