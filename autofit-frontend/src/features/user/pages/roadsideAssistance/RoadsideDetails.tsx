import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, CheckSquare, Car, Shield, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {useApproveQuoteAndPayMutation,useCancelBookingMutation,useRejectQuotationMutation,useRoadsideDetailsQuery} from "../../api/servicesApi";
import RoadsideDetailsShimmer from "../../components/shimmer/RoadsideDetailsShimmer";
import { HeadingSection } from "../../components/roadsideAssistance/HeadingSection";
import { TabsSection } from "../../components/roadsideAssistance/TabsSection";
import { DetailsTabContent } from "../../components/roadsideAssistance/DetailsTabContent";
import { MapTabContent } from "../../components/roadsideAssistance/MapTabContent";
import { PaymentTabContent } from "../../components/roadsideAssistance/PaymentTabContent";
import { LeftColumn } from "../../components/roadsideAssistance/LeftColumn";
import { QuotationModal } from "../../components/roadsideAssistance/QuotationModal";
import { CancellationModal } from "../../components/roadsideAssistance/CancellationModal";
import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/dateFormater";
import { initSocket } from "@/lib/socket";
import ChatBubble from "../../components/ChatBubble";

type ServiceStatus =
  | "assigned"
  | "on_the_way"
  | "analysing"
  | "quotation_sent"
  | "in_progress"
  | "completed"
  | "canceled";

const queryOptions = {
  refetchOnMountOrArgChange: true, 
};

export default function RoadsideDetails() {
  const [activeTab, setActiveTab] = useState("details");
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const serviceId = params.id as string;

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useRoadsideDetailsQuery(serviceId, queryOptions);

  useEffect(()=>{
    const socket = initSocket();
    socket.on('roadside_assistance_changed',()=>{
      refetch()
    })
  },[])

  const [approveAndPay, { isLoading: isPaymentLoading }] = useApproveQuoteAndPayMutation();
  const [cancelBooking] = useCancelBookingMutation();
  const [rejectQuotation] = useRejectQuotationMutation();

  const bookingData = data?.data;

  useEffect(() => {
    if (bookingData?.paymentId) setIsPaymentComplete(true);
    if (bookingData?.status === "canceled") setIsCancelled(true);
  }, [bookingData]);

  const handleRejectQuotation = async () => {
    setIsRejecting(true);
    try {
      await rejectQuotation({serviceId: params.id as string}).unwrap();
      setIsCancelled(true);
      setShowQuotationModal(false);
    } catch (error) {
      console.log("Rejection error:", error);
    }
    setIsRejecting(false);
  };

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      await cancelBooking({ serviceId: params.id as string }).unwrap();
      setIsCancelled(true);
    } catch (error) {
      console.log("Cancellation error:", error);
    }
    setIsCancelling(false);
    setShowCancelModal(false);
  };

  const handlePayment = async () => {
    try {
      const response = await approveAndPay({
        quotationId: bookingData?.quotationId._id,
        serviceId: bookingData._id,
      }).unwrap();
      const { data } = response;
      const query = {
        service_id: params.id || "",
        vehicle: bookingData.vehicle.regNo || "",
        service: "roadside",
        issue: bookingData.issue || "",
      };
      const queryString = new URLSearchParams(query).toString();
      navigate(`/user/payment/${data.orderId}?${queryString}`);
    } catch (error) {
      console.log("Payment initiation error:", error);
    }
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case "assigned":
        return "Booking Confirmed";
      case "on_the_way":
        return "Mechanic En Route";
      case "analysing":
        return "Analysing Issue";
      case "quotation_sent":
        return "Quotation Sent";
      case "in_progress":
        return "Service In Progress";
      case "completed":
        return "Service Completed";
      case "canceled":
        return "Service Cancelled";
      default:
        return "Processing";
    }
  };

  const isStageCompleted = (currentStage: ServiceStatus, bookingStatus: ServiceStatus) => {
    const stagesOrder: ServiceStatus[] = [
      "assigned",
      "on_the_way",
      "analysing",
      "quotation_sent",
      "in_progress",
      "completed",
    ];
    const currentIndex = stagesOrder.indexOf(currentStage);
    const bookingIndex = stagesOrder.indexOf(bookingStatus);
    if (bookingStatus === "canceled") return false;
    return bookingIndex > currentIndex;
  };

  const isStageActive = (currentStage: ServiceStatus, bookingStatus: ServiceStatus) => {
    return currentStage === bookingStatus;
  };

  const timeline = [
    {
      id: 1,
      title: "Booking Confirmed",
      time: bookingData?.createdAt,
      status: bookingData?.status === "canceled" ? "pending" : "completed",
      icon: CheckCircle,
    },
    {
      id: 2,
      title: "Mechanic Assigned",
      time: bookingData?.createdAt,
      status: isStageCompleted("assigned", bookingData?.status) || bookingData?.status === "assigned" ? "completed" : "pending",
      icon: CheckSquare,
    },
    {
      id: 3,
      title: "Mechanic Arrived",
      time: bookingData?.arrivedAt,
      status: isStageCompleted("on_the_way", bookingData?.status)
        ? "completed"
        : isStageActive("on_the_way", bookingData?.status)
        ? "active"
        : "pending",
      icon: Car,
    },
    {
      id: 4,
      title: "Quotation Sent",
      time: bookingData?.quotationId?.createdAt,
      status: isStageCompleted("quotation_sent", bookingData?.status)
        ? "completed"
        : isStageActive("quotation_sent", bookingData?.status)
        ? "active"
        : "pending",
      icon: FileText,
    },
    {
      id: 5,
      title: "Service Started",
      time: bookingData?.startedAt,
      status: isStageCompleted("in_progress", bookingData?.status)
        ? "completed"
        : isStageActive("in_progress", bookingData?.status)
        ? "active"
        : "pending",
      icon: Car,
    },
    {
      id: 6,
      title: "Service Completed",
      time: bookingData?.endedAt,
      status: bookingData?.status === "completed" ? "completed" : "pending",
      icon: Shield,
    },
  ];

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-xl border border-gray-100 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Service Details</h1>
          <p className="text-gray-600 mb-6">An error occurred while fetching the service details. Please try again.</p>
          <div className="space-y-3">
            <Button
              onClick={refetch}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Retry
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <RoadsideDetailsShimmer />;

  return (
    <div className="min-h-screen bg-gradient-to-br mt-16 from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      <main className="container mx-auto px-4 py-6 relative">
        <div className="mb-4 cursor-pointer">
          <div onClick={() => navigate(-1)} className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm">Back</span>
          </div>
        </div>

        <HeadingSection
          title="Booking Confirmed!"
          description="Your mechanic is on the way to help you."
          status={getStatusTitle(bookingData?.status || "Processing")}
          bookingId={bookingData?._id || ""}
          onMessageClick={() => console.log("Message clicked")}
          onCancelClick={() => setShowCancelModal(true)}
          isCancelled={isCancelled}
          isCompleted={bookingData?.status === "completed"}
        />

        <TabsSection
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showTrackTab={bookingData?.status === "on_the_way"}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 order-1 lg:order-2"
          >
            {activeTab === "details" && (
              <DetailsTabContent
                status={bookingData?.status || ""}
                startedAt={bookingData?.startedAt}
                createdAt={bookingData?.createdAt || ""}
                bookingId={bookingData?._id || ""}
                vehicle={bookingData?.vehicle || { brand: "", modelName: "", regNo: "" }}
                issue={bookingData?.issue || ""}
                timeline={timeline}
                onViewQuotation={() => setShowQuotationModal(true)}
                formatDateTime={formatDateTime}
                getStatusTitle={getStatusTitle}
              />
            )}
            {activeTab === "map" && bookingData?.status === "on_the_way" && (
              <MapTabContent
                serviceLocation={bookingData?.serviceLocation || { coordinates: [0, 0] }}
                mechanic={bookingData?.mechanic || { name: "", avatar: "" }}
                bookingId={bookingData?._id}
              />
            )}
            {activeTab === "payment" && (
              <PaymentTabContent
                isPaymentComplete={isPaymentComplete}
                paymentDetails={bookingData.paymentId}
                quotationId={bookingData?.quotationId}
                onViewQuotation={() => setShowQuotationModal(true)}
              />
            )}
          </motion.div>

          <LeftColumn
            mechanic={bookingData?.mechanic || { name: "", avatar: "" }}
            vehicle={bookingData?.vehicle || { brand: "", modelName: "", regNo: "", owner: "" }}
            issue={bookingData?.issue || ""}
            description={bookingData?.description || ""}
          />
        </div>
      </main>
      <ChatBubble serviceId={serviceId} mechanicId={bookingData.mechanic._id} mechanicName={bookingData.mechanic.name} />

      {showQuotationModal && bookingData?.quotationId && (
        <QuotationModal
          quotation={bookingData.quotationId}
          onClose={() => setShowQuotationModal(false)}
          onAccept={handlePayment}
          onReject={handleRejectQuotation}
          isProcessing={isPaymentLoading}
          isRejecting={isRejecting}
        />
      )}

      {showCancelModal && (
        <CancellationModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelBooking}
          isProcessing={isCancelling}
        />
      )}
    </div>
  );
}
