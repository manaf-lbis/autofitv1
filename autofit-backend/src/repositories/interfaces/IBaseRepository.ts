//! it an interface showing the basic and fundamental query of all collections;

import { ObjectId } from "mongodb";

export interface IBaseRepository<T> {

    findById(id: ObjectId): Promise<T | null>;
    findAll(): Promise<T[] | null>;
    save(entity: T): Promise<T>;
    update(id: string, update: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<void>
}




