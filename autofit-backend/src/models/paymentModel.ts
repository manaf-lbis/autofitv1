import { Document, model, Schema, Types } from "mongoose";
import { IPayment } from "../types/payment";

export interface PaymentDocument extends IPayment, Document<Types.ObjectId> {}

const paymentSchema = new Schema<PaymentDocument>({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    paymentId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
    },
    status: {
      type: String,
      enum: ["success", "failed", "cancelled", "pending"],
      required: true,
      default: "pending",
    },
    receipt: {
      type: String,
    },
  },
  { timestamps: true }
);


paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1 });

export const PaymentModel = model<PaymentDocument>("payment", paymentSchema);