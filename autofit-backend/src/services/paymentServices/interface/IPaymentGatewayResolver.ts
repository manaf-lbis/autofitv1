import { IPaymentGateway } from "./IPaymentGateway";

export interface IPaymentGatewayResolver {
    resolve(name: string):IPaymentGateway;
}