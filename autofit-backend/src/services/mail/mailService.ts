import * as Brevo from "@getbrevo/brevo";
import { autofitOtpTemplate } from '../mail/template/otpTemplate';

import dotenv from 'dotenv';
dotenv.config();

const key = process.env.BREVO_API_KEY || "";
const senderEmail = process.env.EMAIL_USER || "";
const senderName = process.env.EMAIL_SENDER_NAME || "Autofit";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, key);

export const sendMail = async (to: string, otp: string, username?: string): Promise<void> => {
  try {
    const htmlContent = autofitOtpTemplate(otp, username);
    const textContent = `Your Autofit OTP is: ${otp}. It's valid for 10 minutes.`;

    const payload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject: "Your Autofit OTP",
      htmlContent,
      textContent,
    };

     await apiInstance.sendTransacEmail(payload as any);

    console.log(`Brevo: queued email to ${to}`);
  } catch (err: any) {
    console.error('Brevo send error full:', err?.response?.data ?? err?.message ?? err);
    throw err;
  }
};
