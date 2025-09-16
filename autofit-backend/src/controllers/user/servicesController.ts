import { NextFunction, Request, Response } from 'express';

import { sendSuccess } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';
import { Types } from 'mongoose';
import { getIO, userSocketMap } from '../../sockets/socket';
import logger from '../../utils/logger';
import { IUserRoadsideService } from '../../services/roadsideAssistance/interface/IUserRoadsideService';
import { IRoadsideService } from '../../services/roadsideAssistance/interface/IRoadsideService';
import { HttpStatus } from '../../types/responseCode';


export class ServicesController {
    constructor(
        private _userRoadsideService: IUserRoadsideService,
        private _roadsideService: IRoadsideService,
    ) { }


    async getNearbyMechanic(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { lat: latitude, lng: longitude } = req.query;
            if (!latitude || !longitude) throw new ApiError('Invalid coordinates')

            const lat = parseFloat(latitude as string);
            const lng = parseFloat(longitude as string);

            const response = await this._userRoadsideService.getNearByMechanic({ lat, lng })

            sendSuccess(res, 'Success', response)

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

            const { emergencyAssistance, notification } = (await this._userRoadsideService.createAssistanceRequest({ mechanicId, vehicleId, issue, description, serviceLocation }))

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

            sendSuccess(res, "Request created successfully", { id: emergencyAssistance._id })

        } catch (error) {
            next(error)
        }
    }

    async serviceDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const serviceId = new Types.ObjectId(req.params.id);
            const serviceDetails = await this._roadsideService.serviceDetails(serviceId)
            sendSuccess(res, 'Successfully Fetched', serviceDetails);
        } catch (error) {
            next(error)
        }
    }



    async cancelQuotation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { serviceId } = req.body
            await this._roadsideService.cancelQuotation({ serviceId })
            sendSuccess(res, 'Service Cancelled')

        } catch (error) {
            next(error)
        }

    }

    async cancelService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { serviceId } = req.body
            await this._roadsideService.cancelService(serviceId)
            logger.info('Service Cancelled by User')
            sendSuccess(res, 'Service Cancelled')

        } catch (error) {
            next(error)
        }

    }

    async getInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { serviceId } = req.body;
            const userId = req.user?.id;
            if (!serviceId || !userId) throw new ApiError("Invalid Service ID or User ID", HttpStatus.BAD_REQUEST);
            if (!Types.ObjectId.isValid(serviceId) || !Types.ObjectId.isValid(userId)) {
                throw new ApiError("Invalid ID format", HttpStatus.BAD_REQUEST);
            }

            const pdfBuffer = await this._roadsideService.getInvoice({
                serviceId: new Types.ObjectId(serviceId),
                userId: new Types.ObjectId(userId),
            });

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=invoice-${serviceId}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            console.error("Invoice error:", error);
            next(error);
        }
    }





}