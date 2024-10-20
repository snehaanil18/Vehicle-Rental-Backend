import twilio from 'twilio'
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;  // Set your Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;    // Set your Auth Token

const client = twilio(accountSid, authToken);

export default client;