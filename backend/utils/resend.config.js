const { Resend } = require('resend');
require('dotenv').config();


if (!process.env.RESEND_API_KEY) {
  console.error('CRITICAL: Resend API key is not defined in the environment variables');
  throw new Error('Resend API key is required');
}


const resendClient = new Resend(process.env.RESEND_API_KEY);


const sender = {

  email: process.env.RESEND_SENDER_EMAIL || "support@rapidroutines.org", 
  name: "RapidRoutines AI",
};


try {
  resendClient.senders.list().then(senders => {
    console.log('Verified Resend senders:', senders);
  }).catch(error => {
    console.error('Error verifying Resend configuration:', error);
  });
} catch (error) {
  console.error('Failed to initialize Resend client:', error);
}

module.exports = {
  resendClient,
  sender
};
