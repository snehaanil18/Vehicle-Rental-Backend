import client from "../../../../Config/Twilio/twilioClient.js";
import otpGenerator from 'otp-generator'
import dotenv from 'dotenv';
dotenv.config();

const phoneController = {
    async sendOTP(phone){
        const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        const otpExpiry = Date.now() + 4 * 60 * 1000;
        console.log(otp);
        
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

        return { success:true, message: 'Message sent successfully'}
        //  message:'Message sent successfully'
    }
}

export default phoneController;