
import { PaymentDocument } from "../../models/paymentModel"
import { IBaseRepository } from "./IBaseRepository";
export interface IPaymentRepository extends IBaseRepository<PaymentDocument>{
    createPayment(entity:Partial<PaymentDocument>):Promise<PaymentDocument>
    updatePayemtStatus( entity: Partial<PaymentDocument> ): Promise<PaymentDocument|null>;
    veryfyPaymentStatus(serviceId: string): Promise<PaymentDocument | null>;
    deletePayment(serviceId: string): Promise<void>;
}