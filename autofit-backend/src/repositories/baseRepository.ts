import { Model, Types, Document } from "mongoose";
import { IBaseRepository } from "./interfaces/IBaseRepository";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async findById(id: Types.ObjectId): Promise<T | null> {
    return await this._model.findById(id).exec();
  }

  async findAll(): Promise<T[]> {
    return await this._model.find().exec();
  }

  async save(entity: Partial<T>): Promise<T> {
    const doc = new this._model(entity);
    return await doc.save();
  }

  async update(id: Types.ObjectId, update: Partial<T>): Promise<T | null> {
    return await this._model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async delete(id: Types.ObjectId): Promise<void> {
    await this._model.findByIdAndDelete(id).exec();
  }
}
