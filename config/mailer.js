

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  secure: true,
  service: 'gmail',
  auth: {
       user: "developer.inventocube@gmail.com",
       pass: "ityk nrre duin yolo",
  },
});



export const sendVerificationEmail = async ({ email, username , verificationUrl }) => {

    console.log("Sending verification email to:", email);
    console.log("Verification URL:", verificationUrl);
    console.log("Username:", username);


 const mailOptions = {
    from: 'RCI <developer.inventocube@gmail.com>',
    to: email,
    subject: "Account Verification",
    text: `Hello ${username},

Welcome to the RCI family! To confirm your registration and contact our support, kindly click the link below or copy-paste it into your browser and press Enter:

${verificationUrl}


We hope you enjoy your experience with us and will endeavor to make it memorable for you. For queries, comments, and suggestions, please do not hesitate to contact us at the given addresses.

Thank you for registering with RCI.

Your username is: ${email}
Your password is: As Set By Yourself

Best Regards,
RCI`,
    
  };

  return transporter.sendMail(mailOptions);
};