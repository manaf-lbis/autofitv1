import Razorpay from "razorpay";
import { IPaymentGateway } from "../interface/IPaymentGateway";
import { PaymentData } from "../interface/IServicePaymentHandler";
import { ApiError } from "../../../utils/apiError";
import crypto from 'crypto';
import { PaymentVerificationResult } from "../interface/IPaymentGateway";

export class RazorpayGateway implements IPaymentGateway {

  private _razorpay: Razorpay;
  private _RAZORPAY_KEY: string;
  private _RAZORPAY_SECRET: string;

  constructor(
    key = process.env.RAZORPAY_KEY_ID,
    secret = process.env.RAZORPAY_KEY_SECRET
  ) {
    if (!key || !secret) {
      throw new ApiError("Razorpay credentials are missing");
    }

    this._RAZORPAY_KEY = key;
    this._RAZORPAY_SECRET = secret;

    this._razorpay = new Razorpay({
      key_id: this._RAZORPAY_KEY,
      key_secret: this._RAZORPAY_SECRET,
    });
  }

  async createPayment(data: PaymentData): Promise<{ orderId: string, amountInRupees: number }> {
    const receipt = `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`;
    try {
      const order = await this._razorpay.orders.create({
        amount: data.amount * 100,
        currency: "INR",
        receipt,
        notes: data.metadata,
      });
      return { orderId: order.id, amountInRupees: data.amount };

    } catch (error: any) {
      throw new ApiError("Failed to create order : " + error.message);
    }
  }


  async verifyPayment(data: any): Promise<PaymentVerificationResult> {
    try {
      const { status, razorpay_payment_id, razorpay_signature, gateway, orderId } = data;

      if (status === 'failed') {
        return { status: 'failed', gateway }
      };

      const generatedSignature = crypto
        .createHmac("sha256", this._RAZORPAY_SECRET)
        .update(orderId + "|" + razorpay_payment_id)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) throw new ApiError("Payment verification failed");

      const orderDetails = await this._razorpay.orders.fetch(orderId);
      const paymentDetails = await this._razorpay.payments.fetch(razorpay_payment_id);

      return {
        amount: Number(paymentDetails.amount) / 100,
        paymentId: paymentDetails.id,
        status,
        method: paymentDetails.method,
        userId: paymentDetails.notes.userId,
        serviceId: paymentDetails.notes.serviceId,
        receipt: orderDetails.receipt!
      }

    } catch (error: any) {
      throw new ApiError(`Failed to verify payment: ${error.message}`);
    }



  }





}




