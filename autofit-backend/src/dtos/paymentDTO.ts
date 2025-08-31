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

