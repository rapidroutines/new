const { Resend } = require('resend');
require('dotenv').config();

// Verify API key exists
if (!process.env.RESEND_API_KEY) {
  console.error('CRITICAL: Resend API key is not defined in the environment variables');
  throw new Error('Resend API key is required');
}

// Initialize Resend client
const resendClient = new Resend(process.env.RESEND_API_KEY);

// Sender configuration
const sender = {
  // IMPORTANT: Use a verified domain from your Resend account
  email: process.env.RESEND_SENDER_EMAIL || "support@rapidroutines.org", 
  name: "RapidRoutines AI",
};

// Validate Resend configuration
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