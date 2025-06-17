import Razorpay from "razorpay";
import crypto from "crypto";
import { ApiError } from "../utils/apiError";
import { IPaymentRepository } from "./interfaces/IPaymentRepository";

export class RazorpayRepository implements IPaymentRepository {
    private razorpay: Razorpay;
    private RAZORPAY_KEY: string;
    private RAZORPAY_SECRET: string;

    constructor(
        key = process.env.RAZORPAY_KEY_ID,
        secret = process.env.RAZORPAY_KEY_SECRET
    ) {
        if (!key || !secret) {
            throw new ApiError("Razorpay credentials are missing");
        }

        this.RAZORPAY_KEY = key;
        this.RAZORPAY_SECRET = secret;

        this.razorpay = new Razorpay({
            key_id: this.RAZORPAY_KEY,
            key_secret: this.RAZORPAY_SECRET,
        });
    }

    async createOrder(amount: number): Promise<{ orderId: string }> {

        const receipt = `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`;

        try {
            const order = await this.razorpay.orders.create({
                amount: amount * 100,
                currency: "INR",
                receipt,
            });

            return { orderId: order.id };
        } catch (error) {
            console.error("Razorpay order creation failed:", error);
            throw new ApiError("Failed to create order");
        }
    }

    verifyPayment(paymentId: string, orderId: string, signature: string): boolean {
        try {
            const generatedSignature = crypto
                .createHmac("sha256", this.RAZORPAY_SECRET)
                .update(orderId + "|" + paymentId)
                .digest("hex");

            return generatedSignature === signature;
        } catch (error) {
            console.error("Signature verification failed:", error);
            return false;
        }
    }
}
