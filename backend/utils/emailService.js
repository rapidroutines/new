const { 
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE 
  } = require('./emailTemplates');
  const { resendClient, sender } = require('./resend.config');
  
  const sendVerificationEmail = async (email, verificationToken) => {
    try {
      const response = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      });
  
      console.log("Email sent successfully", response);
      return response;
    } catch (error) {
      console.error(`Error sending verification email:`, error);
      throw new Error(`Error sending verification email: ${error.message}`);
    }
  };
  
  const sendWelcomeEmail = async (email, name) => {
    try {
      const response = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to RapidRoutines",
        html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
      });
  
      console.log("Welcome email sent successfully", response);
      return response;
    } catch (error) {
      console.error(`Error sending welcome email`, error);
      throw new Error(`Error sending welcome email: ${error.message}`);
    }
  };
  
  const sendPasswordResetEmail = async (email, resetURL) => {
    try {
      const response = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Reset your password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      });
  
      console.log("Password reset email sent successfully", response);
      return response;
    } catch (error) {
      console.error(`Error sending password reset email`, error);
      throw new Error(`Error sending password reset email: ${error.message}`);
    }
  };
  
  const sendResetSuccessEmail = async (email) => {
    try {
      const response = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Password Reset Successful",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      });
  
      console.log("Password reset success email sent successfully", response);
      return response;
    } catch (error) {
      console.error(`Error sending password reset success email`, error);
      throw new Error(`Error sending password reset success email: ${error.message}`);
    }
  };
  
  module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail
  };