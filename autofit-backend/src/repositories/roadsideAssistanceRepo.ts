import { Types } from "mongoose";
import { RoadsideAssistanceDocument, RoadsideAssistanceModel } from "../models/roadsideAssistanceModel";
import { IRoadsideAssistanceRepo } from "./interfaces/IRoadsideAssistanceRepo";
import { CreateRoadsideAssistanceDTO } from "../types/services";

export class RoadsideAssistanceRepository implements IRoadsideAssistanceRepo {

    async save(entity: RoadsideAssistanceDocument ): Promise<RoadsideAssistanceDocument> {
        return await new RoadsideAssistanceModel(entity).save();
    }

    async create(entity: CreateRoadsideAssistanceDTO): Promise<RoadsideAssistanceDocument> {
        const model = new RoadsideAssistanceModel(entity);
        return await model.save()
    }

    async findAll(): Promise<RoadsideAssistanceDocument[] | null> {
        return await RoadsideAssistanceModel.find().populate('userId mechanicId quotationId paymentId').exec();
    }

    async findById(id: Types.ObjectId): Promise<RoadsideAssistanceDocument | null> {
        return await RoadsideAssistanceModel.findById(id).populate('userId mechanicId quotationId paymentId').exec();
    }

    async update(id: Types.ObjectId, update: Partial<RoadsideAssistanceDocument>): Promise<RoadsideAssistanceDocument | null> {
        return await RoadsideAssistanceModel.findByIdAndUpdate(id, update, { new: true }).exec();
    }

    async delete(id: Types.ObjectId): Promise<void> {
        await RoadsideAssistanceModel.findByIdAndDelete(id).exec();
    }

    async findByUserId(userId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | null> {
        return await RoadsideAssistanceModel.find({ userId })
            .populate('userId mechanicId quotationId paymentId')
            .exec();
    }

    async findByMechanicId(mechanicId: Types.ObjectId): Promise<RoadsideAssistanceDocument[] | null> {
        return await RoadsideAssistanceModel.find({ mechanicId })
            .populate('userId mechanicId quotationId paymentId')
            .exec();
    }
}