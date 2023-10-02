const nodemailer = require("nodemailer");
const dotenv= require('dotenv');
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    from:process.env.SMTP_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions,(err)=>{
    if(err){
      console.log(err);
    }
    else{
        console.log("Email sent");
    }
}
  );

};

module.exports = sendEmail;
