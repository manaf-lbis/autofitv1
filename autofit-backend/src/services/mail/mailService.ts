import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
});

  
export const sendMail = async (to: string ,otp : string) => {

  const templatePath = path.resolve(__dirname, "template", "otpTemplate.html");
  let htmlContent = fs.readFileSync(templatePath, "utf-8");

  htmlContent = htmlContent.replace("{{OTP_CODE}}", otp);
  
    const mailOptions = {
      from: `"AutoFit" <${process.env.EMAIL_USER}>`,
      to ,
      subject : 'Your OTP Code',
      html: htmlContent,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Error sending email:", err);
      throw err;
    }
  };