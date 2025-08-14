import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { Types } from "mongoose";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { IPageService } from "./interface/IPageService";
import { IPretripBookingRepository } from "../../repositories/interfaces/IPretripBookingRepository";



export class PageService implements IPageService {
  constructor(
    private _mechanicProfileRepository: IMechanicProfileRepository,
    private _notificationRepository: INotificationRepository,
    private _roadsideAssistanceRepo: IRoadsideAssistanceRepo,
    private _pretripBookingRepository: IPretripBookingRepository
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

    return { recentActivities, emergencyRequest, pickupSchedules , workOnProgress ,workCompleted};
  }




}