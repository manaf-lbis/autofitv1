import { LiveAssistanceDocument } from "../models/liveAssistanceModel";
import { LiveAssistanceStatus } from "../types/liveAssistance";
import { MechanicMapper, MechnaicNameAndEmailDTO } from "./mechnaicDTO";
import { PaymentAmountDTO, PaymentMapper } from "./paymentDTO";

export interface LiveAssistanceInfoDTO {
    id: string,
    mechanicId: MechnaicNameAndEmailDTO,
    status: LiveAssistanceStatus,
    issue: string,
    description: string,
    price: number,
    startTime: Date,
    endTime: Date,
    paymentId: PaymentAmountDTO
}



export class LiveAssistanceMapper {

    static toLiveAssistanceInfo(assistance: LiveAssistanceDocument): LiveAssistanceInfoDTO {
        return {
            id: assistance._id.toString(),
            mechanicId: MechanicMapper.toMechnaicNameEmail(assistance.mechanicId as any),
            status: assistance.status,
            issue: assistance.issue,
            description: assistance.description,
            price: assistance.price,
            startTime: assistance.startTime,
            endTime: assistance.endTime,
            paymentId: PaymentMapper.toPaymentAmount(assistance.paymentId as any)
        };
    };





}


