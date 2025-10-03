import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/apiError";
import { sendSuccess } from "../../utils/apiResponse";
import { INotificationService } from "../../services/notifications/INotificationService";
import { HttpStatus } from "../../types/responseCode";

export class NotificationController {
    constructor(
        private _notificationService: INotificationService
    ) { }

    async getNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            if (!userId) throw new ApiError("Invalid User", HttpStatus.UNAUTHORIZED)

            const notifications = await this._notificationService.getNotifications(userId)
            sendSuccess(res, 'Notifications', notifications);
        } catch (error: any) {
            next(error);
        }
    }

    async updateNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id
            if (!userId) throw new ApiError("Invalid User", HttpStatus.UNAUTHORIZED)

            await this._notificationService.updateNotificationStatus(userId)
            sendSuccess(res, 'Notifications');
        } catch (error: any) {
            next(error);
        }
    }




}