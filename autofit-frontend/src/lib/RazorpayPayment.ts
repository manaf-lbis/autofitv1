interface RazorpayOptions {
  orderId: string;
  amount: number;
  userName: string;
  email: string;
  mobile: string;
  onSuccess: (response: any) => void;
  onFailure?: (response: any) => void;
}


export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const scriptId = "razorpay-script";

    const existingScript = document.getElementById(scriptId);
    if (existingScript) return resolve(true);

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}



export async function triggerRazorpayPayment({
  orderId,
  amount,
  userName,
  email,
  mobile,
  onSuccess,
  onFailure,
}: RazorpayOptions) {
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const options: any = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID!,
    amount: amount * 100,
    currency: "INR",
    name: "AutoFit",
    description: "Service Payment",
    order_id: orderId,
    handler: onSuccess,
    prefill: {
      name: userName,
      email: email,
      contact: mobile,
    },
    theme: {
      color: "#3399cc",
    },
  };

  const razorpay = new (window as any).Razorpay(options);

  razorpay.on("payment.failed", function (response: any) {
    if (onFailure) onFailure(response.error);
  });

  razorpay.open();
}
