import { IMechanicProfileRepository } from "../../repositories/interfaces/IMechanicProfileRepository";
import { Types } from "mongoose";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";




export class PageService {
  constructor(
    private mechanicProfileRepository: IMechanicProfileRepository,
    private notificationRepository : INotificationRepository
  ) { }

  async primaryInfo(mechanicId: Types.ObjectId) {

    const response = await this.mechanicProfileRepository.getAvailablity(mechanicId)
    const availability = response?.availability ?? 'notAvailable'

    const notifications = await this.notificationRepository.findByRecipientId(mechanicId)

    return { availability , notifications , messages : 0}
  }



  async dashboard(mechanicId: Types.ObjectId) {
    return 'dashboard' 
  }



}