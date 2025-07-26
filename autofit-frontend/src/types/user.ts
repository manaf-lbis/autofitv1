export interface User {
    id: string;
    name: string;
    email: string;
    role: string
}

export enum ServiceType {
  ROADSIDE= 'roadside',
  PRETRIP= 'pretrip',
  LIVE= 'liveAssistance',
}

export enum PaymentGateway {
  RAZORPAY = "razorpay",
  STRIPE = "stripe",
  PAYPAL = "paypal",
}