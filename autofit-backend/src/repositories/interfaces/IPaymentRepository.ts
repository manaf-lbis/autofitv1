
import { PaymentDocument } from "../../models/paymentModel"
export interface IPaymentRepository {
    createPayment(entity:Partial<PaymentDocument>):Promise<PaymentDocument>
    updatePayemtStatus( entity: Partial<PaymentDocument> ): Promise<PaymentDocument|null>;
    veryfyPaymentStatus(serviceId: string): Promise<PaymentDocument | null>;
    deletePayment(serviceId: string): Promise<void>;
}