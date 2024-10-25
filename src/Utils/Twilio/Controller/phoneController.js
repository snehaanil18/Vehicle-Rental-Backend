import client from "../../../../Config/Twilio/twilioClient.js";
import otpGenerator from 'otp-generator'
import dotenv from 'dotenv';
dotenv.config();

const phoneController = {
    async sendOTP(phone){
        const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const otpExpiry = Date.now() + 4 * 60 * 1000;


        const otpDetails={
            otp:otp,
            expiry:otpExpiry
        }
        
        const messageResponse = await client.messages.create({
            body: `Your OTP for Account Verification is ${otp}`,  
            from: process.env.TWILIO_PHONE_NO,  
            to:`+91 ${phone}` ,
        });

        if(!messageResponse.sid){
            return{
                success:false, message:'Message not sent'
            }
        }

        return { success:true, message: 'Message sent successfully',detail:otpDetails}
        //  message:'Message sent successfully'
    },

    async verifyOTP(phone, otp, context) {

        
        // Retrieve the OTP details from the session for the given phone number
        const sessionOtpDetails = context.req.session;

        
        // Check if OTP exists for the phone number
        if (!sessionOtpDetails) {
            return { success: false, message: 'OTP not sent or expired.' };
        }

        // Check if OTP is expired
        if (Date.now() > sessionOtpDetails.expiry) {
            return { success: false, message: 'OTP has expired.' };
        }

        // Validate the OTP
        if (otp !== sessionOtpDetails.otp) {
            return { success: false, message: 'Invalid OTP.' };
        }

        // If OTP is valid, clear the session OTP details
        

        return { success: true, message: 'OTP verified successfully.' };
    }

}

export default phoneController;