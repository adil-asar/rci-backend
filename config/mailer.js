

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",          
  port: 465,                        
  secure: true,                    
  auth: {
    user: "developer.inventocube@gmail.com",
    pass: "ityk nrre duin yolo",   
  },
  connectionTimeout: 10000,        
  greetingTimeout: 5000,
  socketTimeout: 10000,
  tls: {
    rejectUnauthorized: false,    
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


export const orderConfirmation = async ({ email, username, service, phone, address, city, state, deliveryAddress, deliveryCity, deliveryState }) => {
  console.log("Sending order confirmation email to:", email);

  const mailOptions = {
    from: 'RCI <developer.inventocube@gmail.com>',
    to: email,
    subject: "Your Order Has Been Confirmed – RCI",
    text: `Hi ${username},

Thank you for your order and for choosing RCI!

Your order has been successfully confirmed and is now being processed. Below are your order details:

📦 Service: ${service}
📞 Phone: ${phone}

📍 Billing Address:
${address}
${city}, ${state}

🚚 Delivery Address:
${deliveryAddress}
${deliveryCity}, ${deliveryState}

If you have any questions or need support, feel free to reach out at any time.

Best regards,  
Team RCI  
developer.inventocube@gmail.com`,
  };

  return transporter.sendMail(mailOptions);
};

