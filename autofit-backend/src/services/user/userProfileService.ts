import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { ApiError } from "../../utils/apiError";
import { Types } from "mongoose";
import { IUserProfileService, liveAssistanceServiceHistoryResponse, PretripServiceHistoryResponse } from "./Interface/IUserProfileService";
import { HttpStatus } from "../../types/responseCode";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { Role } from "../../types/role";
import { IPretripBookingRepository } from "../../repositories/interfaces/IPretripBookingRepository";
import { ILiveAssistanceRepository } from "../../repositories/interfaces/ILiveAssistanceRepository";
import { UserMapper } from "../../dtos/userDto";
import { RoadsideAssistanceMapper } from "../../dtos/roadsideAssistanceDTO";
import { PretripMapper } from "../../dtos/pretripDto";
import { LiveAssistanceMapper } from "../../dtos/liveAssistanceDTO";
import { HashService } from "../hash/hashService";
import { RoadsideAssistance, ServiceType } from "../../types/services";
import { ILiveAssistance } from "../../types/liveAssistance";
import { IPretripBooking } from "../../types/pretrip";
import { IRatingRepository } from "../../repositories/interfaces/IRatingRepository";
import { Sort } from "../../types/rating";



export class UserProfileService implements IUserProfileService {
    constructor(
        private _userRepository: IUserRepository,
        private _roadsideAssistanceRepo: IRoadsideAssistanceRepo,
        private _pretripBookingRepository: IPretripBookingRepository,
        private _liveAssistanceRepository: ILiveAssistanceRepository,
        private _hashService: HashService,
        private _RatingRepository: IRatingRepository
    ) { }

    async updateUser({ name, email, mobile, userId }: { name: string, email: string, mobile: string, userId: Types.ObjectId }) {
        const response = await this._userRepository.findByEmail(email)
        if (response && !response._id.equals(userId)) throw new ApiError('User With Email Already Exists', HttpStatus.BAD_REQUEST)
        const user = await this._userRepository.update(userId, { name, email, mobile });
        if (!user) throw new ApiError('Invalid User');
        return UserMapper.toUserBasicInfo(user)
    }


    async roadsideServiceHistory(userId: Types.ObjectId, page: number) {
        const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
        const start = Number(page) <= 0 ? 0 : (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const response = await this._roadsideAssistanceRepo.pagenatedRoadsideHistory({ end, start, userId, role: Role.USER, sortBy: 'desc' })

        return {
            totalDocuments: response.totalDocuments,
            hasMore: response.totalDocuments > end,
            history: response.history.map((item) => {
                return RoadsideAssistanceMapper.toRoadsideAssistanceInfo(item)
            })
        }
    }

    async pretripServiceHistory(userId: Types.ObjectId, page: number): Promise<PretripServiceHistoryResponse> {
        const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
        const start = Number(page) <= 0 ? 0 : (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const response = await this._pretripBookingRepository.pagenatedPretripHistory({ end, start, userId, role: Role.USER, sortBy: 'desc' })

        return {
            totalDocuments: response.totalDocuments,
            hasMore: response.totalDocuments > end,
            history: response.history.map((item) => {
                return PretripMapper.toPretripInfo(item)
            })
        }

    }

    async liveAssistanceServiceHistory(userId: Types.ObjectId, page: number): Promise<liveAssistanceServiceHistoryResponse> {
        const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
        const start = Number(page) <= 0 ? 0 : (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const response = await this._liveAssistanceRepository.pagenatedLiveAssistanceHistory({ end, start, userId, role: Role.USER, sortBy: 'desc' })

        return {
            totalDocuments: response.totalDocuments,
            hasMore: response.totalDocuments > end,
            history: response.history.map((item) => {
                return LiveAssistanceMapper.toLiveAssistanceInfo(item)
            })
        }
    }

    async addReview(userId: Types.ObjectId, review: string, rating: number, serviceId: Types.ObjectId, serviceType: ServiceType): Promise<any> {

        let service: RoadsideAssistance | IPretripBooking | ILiveAssistance | null

        switch (serviceType) {

            case ServiceType.ROADSIDE:
                service = await this._roadsideAssistanceRepo.findById(serviceId);
                break;
            case ServiceType.PRETRIP:
                service = await this._pretripBookingRepository.findById(serviceId);
                break;
            case ServiceType.LIVE:
                service = await this._liveAssistanceRepository.findById(serviceId);
                break;
            default:
                throw new ApiError('Invalid Service Type', HttpStatus.BAD_REQUEST);
        }

        if (service?.ratingId) throw new ApiError('Review Already Added', HttpStatus.BAD_REQUEST);

        const reviewResponse = await this._RatingRepository.save({
            userId,
            review,
            rating,
            serviceId,
            serviceType,
            mechanicId: serviceType === ServiceType.ROADSIDE ? (service as any)?.mechanic?._id : service?.mechanicId,
        });

        switch (serviceType) {

            case ServiceType.ROADSIDE:
                await this._roadsideAssistanceRepo.update(serviceId, { ratingId: reviewResponse._id });
                break;
            case ServiceType.PRETRIP:
                await this._pretripBookingRepository.update(serviceId, { ratingId: reviewResponse._id });
                break;
            case ServiceType.LIVE:
                await this._liveAssistanceRepository.update(serviceId, { ratingId: reviewResponse._id });
                break;
            default:
                throw new ApiError('Invalid Service Type', HttpStatus.BAD_REQUEST);

        }

    }

    async listReviews(mechanic: Types.ObjectId, page: number, sort: Sort): Promise<any> {
        const itemsPerPage = Number(process.env.ITEMS_PER_PAGE);
        const start = Number(page) <= 0 ? 0 : (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return await this._RatingRepository.pagenatedRatings(start, end, mechanic, sort);
    }



}
