import { Types } from "mongoose";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { RoadsideAssistanceDocument } from "../../models/roadsideAssistanceModel";
import { IQuotationRepository } from "../../repositories/interfaces/IQuotationRepository";
import { QuotationDocument } from "../../models/quotationModel";
import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { IRoadsideService, LiveAssistanceHistoryResponse } from "./interface/IRoadsideService";
import { ITransactionRepository } from "../../repositories/interfaces/ITransactionRepository";
import { TransactionStatus } from "../../types/transaction";
import { generateTransactionId, getDeductionRate } from "../../utils/transactionUtils";
import { RoadsideAssistanceStatus, RoadsideQuotationStatus, ServiceType } from "../../types/services";
import { IPaymentRepository } from "../../repositories/interfaces/IPaymentRepository";
import { generateReceiptPDF } from "../../utils/templates/receiptTemplate";
import { formatDate } from "date-fns";
import { Role } from "../../types/role";
import { MechanicAvailabilityStatus } from "../../types/mechanic/mechanic";
import { INotificationService } from "../notifications/INotificationService";

export class RoadsideService implements IRoadsideService {
  constructor(
    private _roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private _quotationRepo: IQuotationRepository,
    private _mechanicProfileRepo: IMechanicProfileRepository,
    private _transactionRepo: ITransactionRepository,
    private _paymentRepo: IPaymentRepository,
    private _notificationService: INotificationService

  ) { }

  async serviceDetails(serviceId: Types.ObjectId) {
    return await this._roadsideAssistanceRepo.findById(serviceId);
  }

  async updateStatus(userId: Types.ObjectId, serviceId: Types.ObjectId, entity: Partial<RoadsideAssistanceDocument>) {

    if (entity.status === 'analysing') {
      entity.arrivedAt = new Date()
    } else if (entity.status === 'completed') {
      entity.endedAt = new Date()
      await this._mechanicProfileRepo.findByMechanicIdAndUpdate(userId, { availability: MechanicAvailabilityStatus.AVAILABLE });

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
    const response = await this._roadsideAssistanceRepo.update(serviceId, { quotationId: _id, status: RoadsideAssistanceStatus.QUOTATION_SENT });

    await this._notificationService.sendNotification({
      recipientId: response?.userId!,
      message: `Quotation for roadside assistance has been sent, please check your service Details to accept or reject the quotation.`,
      recipientType: 'user'
    })

    return response
  }

  async cancelQuotation({ serviceId }: { serviceId: Types.ObjectId }) {
    const response = await this._roadsideAssistanceRepo.update(serviceId, { status: RoadsideAssistanceStatus.CANCELED })
    if (response) {
      await this._quotationRepo.update(response?.quotationId as Types.ObjectId, { status: RoadsideQuotationStatus.REJECTED });
      await this._mechanicProfileRepo.findByMechanicIdAndUpdate(response?.mechanicId, { availability: MechanicAvailabilityStatus.AVAILABLE })
    }
  }

  async cancelService({ serviceId }: { serviceId: Types.ObjectId }) {

    const response = await this._roadsideAssistanceRepo.update(serviceId, { status: RoadsideAssistanceStatus.CANCELED })
    if (response?.quotationId) {
      await this._quotationRepo.update(response?.quotationId as Types.ObjectId, { status: RoadsideQuotationStatus.REJECTED });
    }

    if (response) {
      await this._mechanicProfileRepo.findByMechanicIdAndUpdate(response?.mechanicId, { availability: MechanicAvailabilityStatus.AVAILABLE })
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

    if (!service.quotationId) throw new Error("No Serive Updated");
    const quotation = await this._quotationRepo.findById(service.quotationId);

    if (!quotation) throw new Error("No Serive Updated");
    if (quotation.status !== "approved") throw new Error("Quotation not approved");

    const items = quotation.items.map((item) => {
      return {
        description: item.name,
        rate: item.price,
        qty: item.quantity
      }
    })

    return generateReceiptPDF({
      customer: {
        name: (service as any).user.name,
        email: (service as any).user.email,
        phone: (service as any).user.mobile
      },
      items: items,
      serviceDate: formatDate(service?.endedAt!, "dd MMM yyyy") ?? new Date().toISOString(),
      discount: { type: "percent", value: 0 },
      notes: `Service For the ${service.description} Completed Successfully! Thank you for using Autofit!!`,
      tax: { type: "percent", value: 5 },
      documentType: "INVOICE",
      reference: serviceId.toString(),
    });
  };


  async serviceHistory(mechanicId: Types.ObjectId, page: number, search?: string): Promise<LiveAssistanceHistoryResponse> {

    const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
    const start = Number(page) <= 0 ? 0 : (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const response = await this._roadsideAssistanceRepo.pagenatedRoadsideHistory({ end, start, role: Role.MECHANIC, userId: mechanicId, search });
    return {
      totalDocuments: response.totalDocuments,
      hasMore: response.totalDocuments > end,
      history: response.history
    }

  }





}