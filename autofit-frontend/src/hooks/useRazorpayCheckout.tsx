import { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpayCheckout = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const scriptId = "razorpay-sdk";
    if (document.getElementById(scriptId)) return setIsReady(true);

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsReady(true);
    script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);
  }, []);

  const openRazorpay = ({ orderId,user,onSuccess,onFail}: {
    orderId: string; user: { name: string; email: string; contact: string };
    onSuccess: (data: { paymentId: string; orderId: string; signature: string }) => void;
    onFail?: () => void;
  }) => {
        console.log(orderId,'orderId')
    if (!window.Razorpay) return;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      name: "AutoFit",
      description: "Payment",
      order_id: orderId,
      prefill: user,
      handler: function (response: any) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: onFail,
      },
      theme: { color: "#6366f1" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return { isReady, openRazorpay };
};
