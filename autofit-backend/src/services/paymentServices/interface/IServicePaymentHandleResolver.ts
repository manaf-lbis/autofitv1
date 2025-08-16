import { IServicePaymentHandler } from "./IServicePaymentHandler";

export interface IServicePaymentHandleResolver {
    resolve(serviceType: string): IServicePaymentHandler
}