// src/features/user/pages/profile/PaymentPage.tsx
import { useState } from "react";
import { CreditCard, Smartphone, Wallet, Shield, CheckCircle2, Clock, Wrench, Car, Truck, ArrowLeft, Lock, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useRazorpayPayment } from "@/hooks/payment/useRazorpayPayment";
import { useVerifyPaymentMutation } from "../../../../services/userServices/servicesApi";

interface OrderDetails {
    orderId: string;
    serviceType: "roadside" | "pretrip" | "live";
    serviceName: string;
    vehicleId: string;
    amount: number;
    currency: string;
    status: "pending" | "processing" | "completed";
    createdAt: string;
}

interface PaymentGateway {
    id: string;
    name: string;
    icon: any;
    description: string;
}

const paymentGateways: PaymentGateway[] = [
    {
        id: "stripe",
        name: "Stripe",
        icon: CreditCard,
        description: "Credit/Debit Cards, Digital Wallets",
    },
    {
        id: "razorpay",
        name: "Razorpay",
        icon: Smartphone,
        description: "UPI, Cards, Net Banking, Wallets",
    },
    {
        id: "paypal",
        name: "PayPal",
        icon: Wallet,
        description: "PayPal Balance, International Cards",
    },
];

// Hardcoded orderData for now; ideally, this should come from the backend or URL params
const orderData: OrderDetails = {
    orderId: "ORD-2024-001234",
    serviceType: "roadside",
    serviceName: "Battery Jump Start",
    vehicleId: "ABC-1234",
    amount: 1500,
    currency: "INR",
    status: "pending",
    createdAt: "2024-01-16T14:30:00Z",
};

const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
        case "roadside":
            return <Wrench className="h-5 w-5 text-blue-600" />;
        case "pretrip":
            return <Car className="h-5 w-5 text-green-600" />;
        case "live":
            return <Truck className="h-5 w-5 text-purple-600" />;
        default:
            return <Wrench className="h-5 w-5 text-gray-600" />;
    }
};

const getServiceTypeLabel = (serviceType: string) => {
    switch (serviceType) {
        case "roadside":
            return "Roadside Assistance";
        case "pretrip":
            return "Pre-trip Checkup";
        case "live":
            return "Live Assistance";
        default:
            return "Service";
    }
};

const getServiceBadgeColor = (serviceType: string) => {
    switch (serviceType) {
        case "roadside":
            return "bg-blue-50 text-blue-700 border-blue-200";
        case "pretrip":
            return "bg-green-50 text-green-700 border-green-200";
        case "live":
            return "bg-purple-50 text-purple-700 border-purple-200";
        default:
            return "bg-gray-50 text-gray-700 border-gray-200";
    }
};

export default function PaymentPage() {
    const [selectedGateway, setSelectedGateway] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [verifyPayment, { isLoading: verifyingPayment }] = useVerifyPaymentMutation();
    const { initiateRazorpay } = useRazorpayPayment();
    const navigate = useNavigate();
    const { id } = useParams();
    const [params] = useSearchParams();
    const serviceId = params.get('service_id');
    const vehicle = params.get('vehicle');
    const service = params.get('service');
    const issue = params.get('issue');

    const paymentSuccess = async (data: any) => {
        try {
            if (service === 'roadside') {
                const verificationData = {
                    orderId: data.razorpay_order_id,
                    paymentId: data.razorpay_payment_id,
                    signature: data.razorpay_signature,
                };
                await verifyPayment(verificationData).unwrap();
                navigate('/user/payment/status/success');
            }
        } catch (error) {
            console.error("Payment verification failed:", error);
            navigate('/user/payment/status/failed');
        }
    };

    const handleFailedPayment = (error: string) => {
        console.error('Payment failed:', error);
        // Optionally, show a toast notification to the user
    };

    const handlePayment = async () => {
        if (!selectedGateway) return;
        setIsProcessing(true);
        try {
            if (selectedGateway === 'razorpay') {
                await initiateRazorpay({
                    orderId: id as string,
                    serviceType: service as "roadside" | "pretrip" | "live",
                    onSuccess: paymentSuccess,
                    onFailure: handleFailedPayment,
                });
            } else {
                console.log(`Payment gateway ${selectedGateway} not implemented yet.`);
            }
        } catch (error) {
            console.error("Error initiating payment:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {verifyingPayment ? (
                // Loading Screen for Payment Verification
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-xl p-8 shadow-lg text-center border border-gray-200 max-w-sm w-full">
                        <div className="flex justify-center mb-4">
                            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Your Payment</h2>
                        <p className="text-gray-600 mb-4">Please wait while we confirm your payment. This might take a few moments...</p>
                        <div className="flex justify-center">
                            <div className="h-2 w-32 bg-gray-200 rounded-full ">
                                <div className="h-full bg-blue-600 animate-pulse" style={{ width: "100%" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Main Payment Page Content
                <div>
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 p-4 w-full z-40 sticky top-0">
                        <div className="max-w-6xl mx-auto flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2"
                                onClick={() => navigate(-1)}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Complete Payment</h1>
                                <p className="text-sm text-gray-600">Secure checkout for your service</p>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-6xl flex justify-center items-center mx-auto p-4 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Order Summary */}
                            <div className="lg:col-span-1 order-2 lg:order-1">
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

                                    {/* Service Details */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">{getServiceIcon(service as string)}</div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{issue || "Service Issue"}</h3>
                                                <Badge className={`${getServiceBadgeColor(service as string)} text-xs`}>
                                                    {getServiceTypeLabel(service as string)}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Order ID</span>
                                                <span className="font-mono font-medium text-gray-900">{serviceId || "N/A"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Vehicle</span>
                                                <span className="font-medium text-gray-900">{vehicle || "N/A"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Date</span>
                                                <span className="font-medium text-gray-900">
                                                    {new Date(orderData.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                                            <span className="text-2xl font-bold text-blue-600">₹{orderData.amount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-amber-800">Payment Information</p>
                                                <p className="text-xs text-amber-700 mt-1">
                                                    Additional charges may apply by your payment provider.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="lg:col-span-2 order-1 lg:order-2">
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Choose Payment Method</h2>

                                    <div className="space-y-3 mb-6">
                                        {paymentGateways.map((gateway) => {
                                            const Icon = gateway.icon;
                                            const isSelected = selectedGateway === gateway.id;

                                            return (
                                                <div
                                                    key={gateway.id}
                                                    onClick={() => setSelectedGateway(gateway.id)}
                                                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                                                        isSelected
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-lg ${isSelected ? "bg-blue-100" : "bg-gray-100"}`}>
                                                            <Icon className={`h-6 w-6 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-semibold text-gray-900">{gateway.name}</h3>
                                                                {isSelected && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                                                            </div>
                                                            <p className="text-sm text-gray-600">{gateway.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Security Notice */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Shield className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-green-800">Secure Payment</p>
                                                <p className="text-sm text-green-700">Your payment information is encrypted and secure</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Button */}
                                    <Button
                                        onClick={handlePayment}
                                        disabled={!selectedGateway || isProcessing}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? (
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-5 w-5 animate-spin" />
                                                Processing Payment...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Lock className="h-5 w-5" />
                                                Pay ₹{orderData.amount.toLocaleString()} Securely
                                            </div>
                                        )}
                                    </Button>

                                    {!selectedGateway && (
                                        <p className="text-center text-sm text-gray-500 mt-3">Please select a payment method to continue</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}