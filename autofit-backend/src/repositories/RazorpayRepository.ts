import Razorpay from "razorpay";
import crypto from "crypto";
import { ApiError } from "../utils/apiError";
import { IPaymentGateayRepository } from "./interfaces/IPaymentGateayRepository";

export class RazorpayRepository implements IPaymentGateayRepository {
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

    async createOrder(amount: number, serviceId:string): Promise<{ orderId: string }> {

        const receipt = `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`;

        try {
            const order = await this._razorpay.orders.create({
                amount: amount * 100,
                currency: "INR",
                receipt,
                notes:{
                    serviceId
                }
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
                .createHmac("sha256", this._RAZORPAY_SECRET)
                .update(orderId + "|" + paymentId)
                .digest("hex");

            return generatedSignature === signature;
        } catch {
            throw new ApiError("Payment verification failed");
        }
    }

    async payloadFromOrderId(orderId: string) {
       return await this._razorpay.orders.fetch(orderId)
    }

    async payloadFromPaymentId(paymentId: string) {
        return await this._razorpay.payments.fetch(paymentId);
    }
}
