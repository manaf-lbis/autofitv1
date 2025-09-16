import { ApiError } from "../../../utils/apiError";
import { IServicePaymentHandler } from "../interface/IServicePaymentHandler"; 
import { IServicePaymentHandleResolver } from "../interface/IServicePaymentHandleResolver";

export class ServicePaymentHandleResolver implements IServicePaymentHandleResolver {
  
  private handlerMap = new Map<string, IServicePaymentHandler>();

  constructor(handlers: { type: string; handler: IServicePaymentHandler }[]) {
    handlers.forEach(({ type, handler }) =>
      this.handlerMap.set(type.toLowerCase(), handler)
    );
  }

  resolve(type: string): IServicePaymentHandler {
    const handler = this.handlerMap.get(type.toLowerCase());
    if (!handler) throw new ApiError(`No handler for ${type}`);
    return handler;
  }
}