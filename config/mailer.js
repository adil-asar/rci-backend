

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


export const orderConfirmation = async ({
  email,
  username,
  service,
  phone,
  address,
  city,
  state,
  deliveryAddress,
  deliveryCity,
  deliveryState,
  documents = []
}) => {
  console.log("Sending order confirmation email to:", email);

  const documentLinks = documents
    .map((doc, index) => `<li><a href="${doc}" target="_blank">Document ${index + 1}</a></li>`)
    .join("");

  const mailOptions = {
    from: 'RCI <developer.inventocube@gmail.com>',
    to: [email, 'lytnetwork640@gmail.com'], 
    subject: "Your Order Has Been Confirmed – RCI",
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Hi <strong>${username}</strong>,</p>

        <p>Thank you for your order and for choosing <strong>RCI</strong>!</p>

        <p>Your order has been successfully confirmed and is now being processed. Below are your order details:</p>

        <h3>📦 Service Details:</h3>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Phone:</strong> ${phone}</p>

        <h3>📍 Billing Address:</h3>
        <p>${address}<br>${city}, ${state}</p>

        <h3>🚚 Delivery Address:</h3>
        <p>${deliveryAddress}<br>${deliveryCity}, ${deliveryState}</p>

        ${
          documents.length
            ? `<h3>📎 Attached Documents:</h3><ul>${documentLinks}</ul>`
            : ""
        }

        <p>If you have any questions or need support, feel free to reach out at any time.</p>

        <p>Best regards,<br>Team RCI<br><a href="mailto:developer.inventocube@gmail.com">developer.inventocube@gmail.com</a></p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};


