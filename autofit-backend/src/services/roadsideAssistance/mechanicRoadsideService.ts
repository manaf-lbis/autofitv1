import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { Types } from "mongoose";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";




export class MechanicRoadsideService {
  constructor(
    private mechanicProfileRepository: IMechanicProfileRepository,
    private notificationRepository: INotificationRepository,
    private roadsideAssistanceRepo : IRoadsideAssistanceRepo
  ) { }



}