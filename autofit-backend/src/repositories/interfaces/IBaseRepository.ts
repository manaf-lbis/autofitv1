import { Types } from "mongoose";

export interface IBaseRepository<T> {

    findById(id: Types.ObjectId): Promise<T | null>;
    findAll(): Promise<T[] | null>;
    save(entity: T): Promise<T>;
    update(id: Types.ObjectId, update: Partial<T>): Promise<T | null>;
    delete(id: Types.ObjectId): Promise<void>
}




