import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, AlertTriangle, DollarSign, Lock, Star, Car, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import razorpayImg from "@/assets/userSide/razorpayImg.png";
import stripImg from "@/assets/userSide/stripe_logo.jpg";
import paypal from "@/assets/userSide/paypal.png";
import { useCreatePaymentMutation, useGetCheckoutQuery } from "@/services/userServices/paymentApi";
import { useNavigate, useParams } from "react-router-dom";
import { PaymentGateway, ServiceType } from "@/types/user";
import Shimmer from "../components/shimmer/PaymentGatewayShimmer";
import { formatDateTime } from "@/lib/dateFormater";
import { triggerRazorpayPayment } from "@/lib/RazorpayPayment";
import { useVerifyPaymentMutation } from "@/services/userServices/paymentApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const paymentGateways = [
  { id: PaymentGateway.RAZORPAY, name: "Razorpay", description: "Pay with UPI, Cards, Wallets & Net Banking", icon: razorpayImg, available: true, primary: true, gatewayCharge: 0 },
  { id: PaymentGateway.STRIPE, name: "Stripe", description: "Secure payments for global transactions", icon: stripImg, available: false, primary: false, gatewayCharge: 29 },
  { id: PaymentGateway.PAYPAL, name: "PayPal", description: "Pay with your PayPal account or linked cards", icon: paypal, available: false, primary: false, gatewayCharge: 35 },
];

export default function PaymentGatewaySelection() {
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>(PaymentGateway.RAZORPAY);
  const userData = useSelector((state: RootState) => state.auth.user);
  const params = useParams();
  const [createPayment, { isLoading: paymentLoading, data: paymentData }] = useCreatePaymentMutation();
  const [verifyPayment, { isLoading: verifyLoading }] = useVerifyPaymentMutation();
  const navigate = useNavigate()

  const { data, isLoading } = useGetCheckoutQuery({ serviceId: params.id!, serviceType: params.service! as ServiceType });

  const handleSuccess = async (data: any) => {
    try {
      await verifyPayment({
        serviceId: params.id!,
        serviceType: params.service! as ServiceType,
        data,
        orderId: paymentData?.data.orderId,
        status: "success",  
        gateway: paymentData?.data.gateway,
      }).unwrap();
      navigate('/user/payment/status/success')
    } catch (error: any) {
      toast.error(error.message);
      navigate('/user/payment/status/failed')
    }
  };

  const handleFail = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    const data = paymentData?.data;
    if (data?.gateway === PaymentGateway.RAZORPAY && userData) {
      console.log("triggered");
      triggerRazorpayPayment({
        amount: data.amountInRupees,
        email: userData.email,
        mobile: userData.mobile,
        orderId: data.orderId,
        onSuccess: handleSuccess,
        userName: userData.name,
        onFailure: handleFail,
      });
    }
  }, [paymentData, userData]);

  if (isLoading) {
    return (
      <div className="min-h-screen mt-14 bg-gray-100 p-8 flex justify-center items-start">
        <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/5 p-8 bg-gray-50 border-r border-gray-100">
            <Shimmer className="mb-8" />
            <div className="space-y-6">
              <Shimmer />
              <Shimmer />
              <Shimmer />
            </div>
            <Shimmer className="mt-auto" />
          </div>
          <div className="md:w-3/5 p-8">
            <Shimmer className="mb-6" />
            <Shimmer className="mb-6" />
            <div className="space-y-4">
              <Shimmer />
              <Shimmer />
              <Shimmer />
            </div>
            <Shimmer className="mt-8" />
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    createPayment({
      gateway: selectedGateway,
      serviceId: params.id!,
      serviceType: params.service! as ServiceType,
    });
  };

  const handleGoBack = () => window.history.back();

  const orderData = data?.data || {
    orderId: "PTC-2025-001234",
    serviceType: "Pre-Trip Checkup",
    vehicleRegNo: "KA01AB1234",
    date: new Date().toISOString(),
    price: 1299,
  };

  const formattedDate = formatDateTime(orderData.date);
  const selectedGatewayData = paymentGateways.find((gateway) => gateway.id === selectedGateway);
  const gatewayCharge = selectedGatewayData?.gatewayCharge || 0;
  const totalAmount = orderData.price + gatewayCharge;
  const originalPrice = orderData.originalPrice ?? orderData.price;

  return (
    <div className="min-h-screen mt-14 bg-gray-100 p-8 flex justify-center items-start relative">
      {(paymentLoading || verifyLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-2/5 p-8 bg-gray-50 border-r border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-8">
              <Button onClick={handleGoBack} variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900 ml-4">Order Summary</h1>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{orderData.serviceType}</h2>
                  <p className="text-xs text-gray-500">Order ID: {orderData.orderId}</p>
                </div>
              </div>

              <div className="space-y-4 text-sm mb-6">
                <div className="flex items-center gap-3">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Vehicle:</span>
                  <span className="font-medium text-gray-900">{orderData.vehicleRegNo}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Date:</span>
                  <span className="font-medium text-gray-900">{formattedDate}</span>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-base font-semibold text-gray-900 mb-4">Price Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Amount</span>
                  <span className="text-gray-500 line-through">₹{originalPrice}</span>
                </div>
                {originalPrice > orderData.price && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-₹{originalPrice - orderData.price}</span>
                  </div>
                )}
                <Separator className="my-3" />
                <div className="flex justify-between font-medium">
                  <span className="text-gray-800">Subtotal</span>
                  <span className="text-gray-900">₹{orderData.price}</span>
                </div>
                {gatewayCharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gateway Charge</span>
                    <span className="text-orange-600">₹{gatewayCharge}</span>
                  </div>
                )}
              </div>
              <Separator className="my-6" />
              <div className="flex justify-between items-center">
                <p className="text-lg text-gray-600">Total Payable</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalAmount}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3 mt-auto">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-green-800 text-sm">Secure Payment</h4>
              <p className="text-xs text-green-700">Your payment information is encrypted and secure.</p>
            </div>
          </div>
        </div>

        <div className="md:w-3/5 p-8 flex flex-col">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h1>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 text-sm">Gateway Charges</h4>
              <p className="text-xs text-yellow-700 mt-1">Additional charges may apply based on your selected payment method.</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {paymentGateways.map((gateway) => (
              <div
                key={gateway.id}
                onClick={() => gateway.available && setSelectedGateway(gateway.id)}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200 ${!gateway.available
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    : selectedGateway === gateway.id
                    ? "border-blue-500 bg-blue-50 shadow-md cursor-pointer"
                    : "border-gray-200 hover:border-gray-300 bg-white cursor-pointer hover:shadow-sm"
                  }`}
              >
                <img src={gateway.icon || "/placeholder.svg"} alt={`${gateway.name} logo`} className="w-10 h-10 object-contain flex-shrink-0" />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{gateway.name}</h3>
                    {gateway.primary && gateway.available && (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" /> Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{gateway.description}</p>
                  {gateway.gatewayCharge > 0 && gateway.available && (
                    <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> +₹{gateway.gatewayCharge} gateway charge
                    </p>
                  )}
                </div>

                {!gateway.available && (
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <X className="w-4 h-4" /> Unavailable
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Button
              onClick={handlePayment}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold rounded-lg shadow-md px-8"
              disabled={!selectedGateway || paymentLoading || !paymentGateways.find((g) => g.id === selectedGateway)?.available}
            >
              {paymentLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">Pay ₹{totalAmount} Securely</div>
              )}
            </Button>
            <p className="text-center text-xs text-gray-500 mt-2">
              By proceeding, you agree to our{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">Terms</span> &{" "}
              <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}