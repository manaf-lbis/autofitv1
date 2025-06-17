
import { PaymentDocument } from "../../models/paymentModel"
export interface IPaymentRepository {
    createPayment(entity:Partial<PaymentDocument>):Promise<PaymentDocument>
}