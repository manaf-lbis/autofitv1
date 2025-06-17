import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Success {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayPaymentProps {
  orderId: string;
  serviceType: string
  onSuccess: (response: Success) => void;
  onFailure: (error: string) => void;
}

export const useRazorpayPayment = () => {
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current || window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      scriptLoadedRef.current = true;
    };
    script.onerror = () => {
      toast.error("Failed to load payment gateway. Please try again.");
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
        scriptLoadedRef.current = false;
      }
    };
  }, []);

  const user = useSelector((state: RootState) => state.auth.user);

  const initiateRazorpay = async ({
    orderId,
    serviceType,
    onSuccess,
    onFailure,
  }: RazorpayPaymentProps) => {

    if (!user) {
      toast.error("User not authenticated. Please log in.");
      onFailure("User not authenticated");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment gateway not ready yet. Please try again.");
      onFailure("Razorpay not initialized");
      return;
    }

    try {
      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: orderId,
        name: "AutoFit",
        description: `Payment for ${serviceType} service`,
        handler: async (response: Success) => {
          try {
            onSuccess(response);
          } catch (error: any) {
            toast.error("Error processing payment response");
            onFailure(error.message || "Error processing payment response");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.mobile || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            onFailure("Payment cancelled by user");
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);

      razorpay.on("payment.error", (error: any) => {
        const errorMessage = error.error?.description || "An error occurred during payment";
        toast.error(errorMessage);
        onFailure(errorMessage);
      });

      razorpay.on("payment.failed", (error: any) => {
        const errorMessage = error.error?.description || "Payment failed";
        toast.error(errorMessage);
        onFailure(errorMessage);
      });

      razorpay.open();
    } catch (error: any) {
      toast.error("Payment Failed. Please Try Again.");
      onFailure(error.message || "Payment initiation failed");
    }
  };

  return { initiateRazorpay };
};