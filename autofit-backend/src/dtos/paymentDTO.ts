import { PaymentDocument } from "../models/paymentModel";


export interface PaymentAmountDTO {
    amount: number
}

export interface PaymentInfoDTO {


}



export class PaymentMapper {

    static toPaymentAmount(assistance: PaymentDocument): PaymentAmountDTO {
        return {
            amount: assistance.amount
        };
    };



}


//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "user",
//       required: true,
//     },
//     serviceId: {
//       type: Schema.Types.ObjectId,
//       required: true,
//     },
//     paymentId: {
//       type: String,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     method: {
//       type: String,
//     },
//     status: {
//       type: String,
//       enum: ["success", "failed", "cancelled", "pending"],
//       required: true,
//       default: "pending",
//     },
//     receipt: {
//       type: String,
//     },
//   },