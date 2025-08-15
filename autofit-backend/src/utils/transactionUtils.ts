import { ServiceType } from "../types/services"; 

export const generateTransactionId = (serviceType: ServiceType): string => {
  const prefixMap: Record<ServiceType, string> = {
    [ServiceType.PRETRIP]: 'TXN-PRE',
    [ServiceType.LIVE]: 'TXN-LIV',
    [ServiceType.ROADSIDE]: 'TXN-ROA',
  };
  const date = new Date();
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
  const sequence = Math.floor(100 + Math.random() * 900).toString();
  return `${prefixMap[serviceType]}-${dateStr}-${sequence}`;
};


export const getDeductionRate = (serviceType: ServiceType): number => {
  const rateMap: Record<ServiceType, number> = {
    [ServiceType.PRETRIP]:Number(process.env.PRETRIP_DEDUCTION),
    [ServiceType.LIVE]: Number(process.env.LIVE_ASSISTANCE_DEDUCTION),
    [ServiceType.ROADSIDE]: Number(process.env.ROADSIDE_DEDUCTION),
  };
  return rateMap[serviceType];
};
