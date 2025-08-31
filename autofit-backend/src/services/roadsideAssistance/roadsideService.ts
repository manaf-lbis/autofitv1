import { Types } from "mongoose";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { RoadsideAssistanceDocument } from "../../models/roadsideAssistanceModel";
import { IQuotationRepository } from "../../repositories/interfaces/IQuotationRepository";
import { QuotationDocument } from "../../models/quotationModel";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IRoadsideService } from "./interface/IRoadsideService";
import { ITransactionRepository } from "../../repositories/interfaces/ITransactionRepository";
import { TransactionStatus } from "../../types/transaction";
import { generateTransactionId, getDeductionRate } from "../../utils/transactionUtils";
import { ServiceType } from "../../types/services";
import { IPaymentRepository } from "../../repositories/interfaces/IPaymentRepository";
import { generateReceiptPDF } from "../../utils/templates/receiptTemplate";
import { formatDate } from "date-fns";

export class RoadsideService implements IRoadsideService {
  constructor(
    private _roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private _quotationRepo: IQuotationRepository,
    private _mechanicProfileRepo: IMechanicProfileRepository,
    private _transactionRepo: ITransactionRepository,
    private _paymentRepo: IPaymentRepository

  ) { }

  async serviceDetails(serviceId: Types.ObjectId) {
    return await this._roadsideAssistanceRepo.findById(serviceId)
  }

  async updateStatus(userId: Types.ObjectId, serviceId: Types.ObjectId, entity: Partial<RoadsideAssistanceDocument>) {

    if (entity.status === 'analysing') {
      entity.arrivedAt = new Date()
    } else if (entity.status === 'completed') {
      entity.endedAt = new Date()
      await this._mechanicProfileRepo.findByMechanicIdAndUpdate(userId, { availability: 'available' });

      const booking = await this._roadsideAssistanceRepo.findById(serviceId);
      if (!booking) throw new Error('Invalid Service');

      const paymentdetais = await this._paymentRepo.findById(booking?.paymentId!);
      if (!paymentdetais) throw new Error('Quotation not found');

      const deductionRate = getDeductionRate(ServiceType.ROADSIDE);

      await this._transactionRepo.save({
        serviceId: serviceId,
        mechanicId: userId,
        status: TransactionStatus.RECEIVED,
        deductionAmount: (deductionRate * paymentdetais?.amount) / 100,
        deductionRate: deductionRate,
        grossAmount: paymentdetais?.amount,
        netAmount: paymentdetais?.amount - (deductionRate * paymentdetais?.amount) / 100,
        description: 'Roadside Assistance',
        transactionId: generateTransactionId(ServiceType.ROADSIDE),
        paymentId: paymentdetais._id,
        userId: paymentdetais.userId,
        serviceType: ServiceType.ROADSIDE,
      });

    }
    return await this._roadsideAssistanceRepo.update(serviceId, entity)
  }

  async createQuotation(entity: Partial<QuotationDocument>) {
    const { _id, serviceId } = await this._quotationRepo.save(entity);
    return await this._roadsideAssistanceRepo.update(serviceId, { quotationId: _id, status: "quotation_sent" });
  }

  async cancelQuotation({ serviceId }: { serviceId: Types.ObjectId }) {
    const response = await this._roadsideAssistanceRepo.update(serviceId, { status: 'canceled' })
    if (response) {
      await this._quotationRepo.update(response?.quotationId as Types.ObjectId, { status: 'rejected' });
      await this._mechanicProfileRepo.findByMechanicIdAndUpdate(response?.mechanicId, { availability: 'available' })
    }
  }

  async cancelService({ serviceId }: { serviceId: Types.ObjectId }) {

    const response = await this._roadsideAssistanceRepo.update(serviceId, { status: 'canceled' })
    if (response?.quotationId) {
      await this._quotationRepo.update(response?.quotationId as Types.ObjectId, { status: 'rejected' });
    }

    if (response) {
      await this._mechanicProfileRepo.findByMechanicIdAndUpdate(response?.mechanicId, { availability: 'available' })
    }
  }

   async getInvoice(params: { serviceId: Types.ObjectId; userId: Types.ObjectId }): Promise<Buffer> {
    const { serviceId, userId } = params;

    if (!Types.ObjectId.isValid(serviceId) || !Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid service ID or user ID format");
    }

    const service = await this._roadsideAssistanceRepo.findById(serviceId);
    if (!service) throw new Error("Service not found");
    if (service.status !== "completed") throw new Error("Service not completed");

    if(!service.quotationId) throw new Error("No Serive Updated");
    const quotation = await this._quotationRepo.findById(service.quotationId);

    if(!quotation) throw new Error("No Serive Updated");
    if (quotation.status !== "approved") throw new Error("Quotation not approved");

    const items = quotation.items.map((item) => {
      return {
        description :item.name,
        rate :item.price,
        qty : item.quantity
      }
    })

    
   
    return generateReceiptPDF({
      customer: { 
        name: 'sanitizedCustomerName',
         email: "manaf@gmail.com",
          phone: "1234567890"
         },
      items:items,
      serviceDate: formatDate(service?.endedAt!, "dd MMM yyyy") ?? new Date().toISOString(),
      discount: { type: "percent", value: 0 },
      notes: `Service For the ${service.description} Completed Successfully! Thank you for using Autofit!!`,
      tax: { type: "percent", value: 5 },
      documentType: "INVOICE",
      reference: serviceId.toString(),
    });
  }





}