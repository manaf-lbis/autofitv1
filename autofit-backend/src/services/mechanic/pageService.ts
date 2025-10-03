import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { Types } from "mongoose";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { IPageService } from "./interface/IPageService";
import { IPretripBookingRepository } from "../../repositories/interfaces/IPretripBookingRepository";
import { TransactionDurations } from "../../types/transaction";
import { ITransactionRepository } from "../../repositories/interfaces/ITransactionRepository";
import { ApiError } from "../../utils/apiError";
import { HttpStatus } from "../../types/responseCode";
import { IRatingRepository } from "../../repositories/interfaces/IRatingRepository";
import { Sort } from "../../types/rating";



export class PageService implements IPageService {
  constructor(
    private _mechanicProfileRepository: IMechanicProfileRepository,
    private _notificationRepository: INotificationRepository,
    private _roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private _pretripBookingRepository: IPretripBookingRepository,
    private _transactionRepo: ITransactionRepository,
    private _ratingRepo: IRatingRepository
  ) { }

  async primaryInfo(mechanicId: Types.ObjectId) {
    const response = await this._mechanicProfileRepository.getAvailablity(mechanicId)
    const availability = response?.availability ?? 'notAvailable'
    return { availability, messages: 0 }
  }



  async dashboard(mechanicId: Types.ObjectId) {

    const reviewData = await this._ratingRepo.pagenatedRatings(0,10, mechanicId, Sort.ALL);

    const reviews = reviewData?.reviews?.map((review: any) => ({
      id: review._id,
      reviewerName: (review.userId as any).name,
      rating: review.rating,
      comment: review.review
    })) ?? null

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

    return { reviews, emergencyRequest, pickupSchedules, workOnProgress, workCompleted };
  }



  async transactions(mechanicId: Types.ObjectId, duration: TransactionDurations, fromStr?: string, toStr?: string): Promise<any> {
    const now = new Date();
    let from: Date;
    let to: Date = now;
    let groupStage: any;
    let projectStage: any;
    let sortStage: any;

    if (duration === TransactionDurations.CUSTOM) {
      if (!fromStr || !toStr) {
        throw new ApiError('From and To dates required', HttpStatus.BAD_REQUEST);
      }
      from = new Date(fromStr + 'T00:00:00.000Z');
      to = new Date(toStr + 'T23:59:59.999Z');
      if (isNaN(from.getTime()) || isNaN(to.getTime()) || to < from) {
        throw new ApiError('Invalid date format or range', HttpStatus.BAD_REQUEST);
      }
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        net: { $sum: "$netAmount" }
      };
      projectStage = {
        _id: 0,
        param: "$_id",
        net: 1
      };
      sortStage = { param: 1 };
    } else {
      switch (duration) {
        case TransactionDurations.DAY:
          from = new Date(now);
          from.setHours(0, 0, 0, 0);
          groupStage = {
            _id: { hour: { $hour: "$createdAt" } },
            net: { $sum: "$netAmount" }
          };
          projectStage = {
            _id: 0,
            param: { $concat: [{ $toString: "$_id.hour" }, ":00"] },
            net: 1
          };
          sortStage = { "_id.hour": 1 };
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

        case TransactionDurations.MONTH: {
          const fromMonth = new Date(now);
          fromMonth.setMonth(fromMonth.getMonth() - 11);
          from = fromMonth;
          groupStage = {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            net: { $sum: "$netAmount" }
          };
          projectStage = {
            _id: 0,
            param: {
              $concat: [
                {
                  $arrayElemAt: [
                    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    { $subtract: ["$_id.month", 1] }
                  ]
                },
                " ",
                { $toString: "$_id.year" }
              ]
            },
            net: 1
          };
          sortStage = { "_id.year": 1, "_id.month": 1 };
          break;
        }

        case TransactionDurations.YEAR: {
          const fromYear = new Date(now);
          fromYear.setFullYear(fromYear.getFullYear() - 4);
          from = fromYear;
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
      }
    }

    const earnings = await this._transactionRepo.earnings(mechanicId, from, to);
    const data = await this._transactionRepo.durationWiseEarnings(mechanicId, groupStage, projectStage, sortStage, from, to);
    const recentEarnings = duration === TransactionDurations.CUSTOM
      ? await this._transactionRepo.recentTransactions(mechanicId, from, to)
      : await this._transactionRepo.recentTransactions(mechanicId);

    return {
      earnings,
      data,
      recentEarnings
    };
  }





}