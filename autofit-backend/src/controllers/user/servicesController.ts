import { NextFunction, Request, Response } from 'express';

import { sendSuccess } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';
import { RoadsideAssistanceService } from '../../services/user/roadsideAssistanceService';
import { Types } from 'mongoose';
import { getIO, userSocketMap } from '../../sockets/socket';


export class ServicesController {
    constructor(
        private roadsideAssistanceService: RoadsideAssistanceService
    ) { }


    async getNearbyMechanic(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { lat: latitude, lng: longitude } = req.query;
            if (!latitude || !longitude) throw new ApiError('Invalid coordinates')

            const lat = parseFloat(latitude as string);
            const lng = parseFloat(longitude as string);

            const response = await this.roadsideAssistanceService.getNearByMechanic({ lat, lng })

            sendSuccess(res, 'yes', response)

        } catch (error) {
            next(error)
        }
    }

    async roadsideAssistance(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { mechanicId: mecId, vehicleId: vehId, issue, description, coordinates } = req.body

            const serviceLocation: [number, number] = [coordinates.lng, coordinates.lat]

            if (!mecId.trim() || !vehId.trim() || !issue.trim() || !description.trim() || serviceLocation.length < 1) {
                throw new ApiError('Invalid Request Body');
            };

            const mechanicId = new Types.ObjectId(mecId)
            const vehicleId = new Types.ObjectId(vehId)

            const { emergencyAssistance, notification } = (await this.roadsideAssistanceService.createAssistanceRequest({ mechanicId, vehicleId, issue, description, serviceLocation }))

            const mechData = userSocketMap.get(mechanicId.toString());
            if (mechData && mechData.socketIds.size > 0) {
                const io = getIO()
                mechData.socketIds.forEach((id) => {
                    io.to(id).emit('notification', {
                        _id: notification._id,
                        message: notification.message,
                        createdAt: notification.createdAt,
                        isRead: notification.isRead
                    });
                    io.to(id).emit('emergency', {
                        _id: emergencyAssistance._id,
                        name: (emergencyAssistance.userId as any).name,
                        issue: emergencyAssistance.issue,
                        description: emergencyAssistance.description,
                        location: emergencyAssistance.serviceLocation.coordinates,
                        time: emergencyAssistance.createdAt,
                        status: emergencyAssistance.status,
                        vehicle: `${emergencyAssistance.vehicle.brand} - ${emergencyAssistance.vehicle.modelName}`
                    })
                })
            }

            sendSuccess(res, "Request created successfully",)

        } catch (error) {
            next(error)
        }
    }


}