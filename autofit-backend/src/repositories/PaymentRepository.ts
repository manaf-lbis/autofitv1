import { IPaymentRepository } from "./interfaces/IPaymentRepository";
import { PaymentDocument, PaymentModel } from "../models/paymentModel";



export class PaymentRepository implements IPaymentRepository {

    async createPayment(entity: Partial<PaymentDocument>): Promise<PaymentDocument> {
        return await new PaymentModel(entity).save();
    }



}