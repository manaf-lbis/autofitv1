declare namespace Razorpay {
  interface Options {
    key: string;
    amount: number;
    currency?: string;
    name?: string;
    description?: string;
    image?: string;
    order_id: string;
    handler?: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: any;
    theme?: {
      color?: string;
    };
  }

  class Razorpay {
    constructor(options: Razorpay.Options);
    open(): void;
    on(event: string, handler: () => void): void;
  }
}
