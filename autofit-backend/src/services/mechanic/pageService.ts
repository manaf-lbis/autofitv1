import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { Types } from "mongoose";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";




export class PageService {
  constructor(
    private mechanicProfileRepository: IMechanicProfileRepository,
    private notificationRepository: INotificationRepository,
    private roadsideAssistanceRepo : IRoadsideAssistanceRepo
  ) { }

  async primaryInfo(mechanicId: Types.ObjectId) {

    const response = await this.mechanicProfileRepository.getAvailablity(mechanicId)
    const availability = response?.availability ?? 'notAvailable'

    const notifications = await this.notificationRepository.findByRecipientId(mechanicId)

    return { availability, notifications, messages: 0 }
  }



 async dashboard(mechanicId: Types.ObjectId) {
  const recentActivities = [{ id: 1, name: "Saraaah Johnson", action: "Engine overheating resolved", time: "2h ago" }];

  const response = await this.roadsideAssistanceRepo.ongoingServiceByMechanicId(mechanicId);
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

  return { recentActivities, emergencyRequest };
}




}