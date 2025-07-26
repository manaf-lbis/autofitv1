import { IPaymentGateway } from "../interface/IPaymentGateway";
import { IPaymentGatewayResolver } from "../interface/IPaymentGatewayResolver";

export class PaymentGatewayResolver implements IPaymentGatewayResolver{
  private gatewayMap = new Map<string, IPaymentGateway>();


  constructor(gateways: { name: string; instance: IPaymentGateway }[]) {
    gateways.forEach(({ name, instance }) =>
      this.gatewayMap.set(name.toLowerCase(), instance)
    );
  }

  resolve(name: string):IPaymentGateway {
    const gateway = this.gatewayMap.get(name.toLowerCase());
    if (!gateway) throw new Error("Invalid Payment Gateway");
    return gateway;

  }
}