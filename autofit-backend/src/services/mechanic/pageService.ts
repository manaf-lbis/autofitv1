import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { Types } from "mongoose";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { IPageService } from "./interface/IPageService";
import { IPretripBookingRepository } from "../../repositories/interfaces/IPretripBookingRepository";
import { TransactionDurations } from "../../types/transaction";
import { ITransactionRepository } from "../../repositories/interfaces/ITransactionRepository";



export class PageService implements IPageService {
  constructor(
    private _mechanicProfileRepository: IMechanicProfileRepository,
    private _notificationRepository: INotificationRepository,
    private _roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private _pretripBookingRepository: IPretripBookingRepository,
    private _transactionRepo: ITransactionRepository
  ) { }

  async primaryInfo(mechanicId: Types.ObjectId) {
    const response = await this._mechanicProfileRepository.getAvailablity(mechanicId)
    const availability = response?.availability ?? 'notAvailable'
    const notifications = await this._notificationRepository.findByRecipientId(mechanicId)
    return { availability, notifications, messages: 0 }
  }



  async dashboard(mechanicId: Types.ObjectId) {
    const recentActivities = [{ id: 1, name: "Saraaah Johnson", action: "Engine overheating resolved", time: "2h ago" }];

    const response = await this._roadsideAssistanceRepo.ongoingServiceByMechanicId(mechanicId);
    const pickupSchedules = await this._pretripBookingRepository.todayScheduleOfMechanic(mechanicId);
    const workOnProgress = await this._pretripBookingRepository.activeWorks(mechanicId);
    const workCompleted = await this._pretripBookingRepository.completedWorks(mechanicId);


    let emergencyRequest = null;
    if (response) {
      const { _id, issue, vehicle, serviceLocation, status, createdAt, description } = response;

      emergencyRequest = {
        _id,
        name: (response.userId as any).name,
        issue,
        description,
        location: serviceLocation.coordinates,
        time: createdAt,
        status,
        vehicle: `${vehicle.brand} - ${vehicle.modelName}`
      };
    }

    return { recentActivities, emergencyRequest, pickupSchedules, workOnProgress, workCompleted };
  }

  async transactions(mechanicId: Types.ObjectId, duration: TransactionDurations): Promise<any> {
 
    const now = new Date();
    let from: Date;
    let groupStage: any;
    let projectStage: any;
    let sortStage: any;

    switch (duration) {
      case TransactionDurations.DAY:
        from = new Date(now.setDate(now.getDate() - 7));
        groupStage = {
          _id: { day: { $dayOfWeek: "$createdAt" } },
          net: { $sum: "$netAmount" }
        };
        projectStage = {
          _id: 0,
          param: {
            $arrayElemAt: [
              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              { $subtract: ["$_id.day", 1] }
            ]
          },
          net: 1
        };
        sortStage = { "_id.day": 1 };
        break;

      case TransactionDurations.WEEK:
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        groupStage = {
          _id: { week: { $ceil: { $divide: [{ $dayOfMonth: "$createdAt" }, 7] } } },
          net: { $sum: "$netAmount" }
        };
        projectStage = {
          _id: 0,
          param: { $concat: ["Week ", { $toString: "$_id.week" }] },
          net: 1
        };
        sortStage = { "_id.week": 1 };
        break;

      case TransactionDurations.MONTH:
        from = new Date(now.setMonth(now.getMonth() - 11));
        groupStage = {
          _id: { month: { $month: "$createdAt" } },
          net: { $sum: "$netAmount" }
        };
        projectStage = {
          _id: 0,
          param: {
            $arrayElemAt: [
              ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              { $subtract: ["$_id.month", 1] }
            ]
          },
          net: 1
        };
        sortStage = { "_id.month": 1 };
        break;

      case TransactionDurations.YEAR:
        from = new Date(now.setFullYear(now.getFullYear() - 4));
        groupStage = {
          _id: { year: { $year: "$createdAt" } },
          net: { $sum: "$netAmount" }
        };
        projectStage = {
          _id: 0,
          param: { $toString: "$_id.year" },
          net: 1
        };
        sortStage = { "_id.year": 1 };
        break;
    }


    const earnings = await this._transactionRepo.earnings(mechanicId, from);
    const data = await this._transactionRepo.durationWiseEarnings(mechanicId, groupStage, projectStage, sortStage, from);
    const recentEarnings = await this._transactionRepo.recentTransactions(mechanicId)

    return {
      earnings,
      data,
      recentEarnings
    }
  }




}