import { Types,Document } from "mongoose";

export interface IBaseRepository<T extends Document> {

    findById(id: Types.ObjectId): Promise<T | null>;
    findAll(): Promise<T[]>;
    save(entity: Partial<T>): Promise<T>;
    update(id: Types.ObjectId, update: Partial<T>): Promise<T | null>;
    delete(id: Types.ObjectId): Promise<void>
    
}




