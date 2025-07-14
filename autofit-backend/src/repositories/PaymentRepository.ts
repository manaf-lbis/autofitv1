import { IPaymentRepository } from "./interfaces/IPaymentRepository";
import { PaymentDocument, PaymentModel } from "../models/paymentModel";



export class PaymentRepository implements IPaymentRepository {

    async createPayment(entity: Partial<PaymentDocument>): Promise<PaymentDocument> {
        return await new PaymentModel(entity).save();
    }

    async veryfyPaymentStatus(serviceId: string): Promise<PaymentDocument | null> {
        return await PaymentModel.findOne({ serviceId });
    };

    async deletePayment(serviceId: string): Promise<void> {
        await PaymentModel.deleteOne({ serviceId });
    };

    async updatePayemtStatus( entity: Partial<PaymentDocument>  ): Promise<PaymentDocument |null> {
        return await PaymentModel.findOneAndUpdate({ serviceId: entity.serviceId }, {...entity },{new: true});
    }





}