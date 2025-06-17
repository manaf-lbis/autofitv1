import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  User,
  Navigation,
  Car,
  AlertTriangle,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Clock,
  Calendar,
  CheckCheck,
  RefreshCw,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RoadsideStatusMech,
  useGenerateQuotationMutation,
  useRoadsideServiceDetailsQuery,
  useRoadsideStatusUpdateMutation,
} from "../api/roadsideApi";
import BookingDetailsShimmer from "../components/shimmer/BookingDetailsShimmer";
import QuotationModal, {
  QuotationData,
} from "../components/service/QuotationModal";
import { initSocket } from "@/lib/socket";

type BookingStatus =
  | "assigned"
  | "on_the_way"
  | "analysing"
  | "quotation_sent"
  | "in_progress"
  | "completed"
  | "canceled";

const statusConfig = {
  assigned: { label: "Assigned", color: "bg-blue-500" },
  on_the_way: { label: "On The Way", color: "bg-orange-500" },
  analysing: { label: "Analysing", color: "bg-yellow-500" },
  quotation_sent: { label: "Quotation Sent", color: "bg-purple-500" },
  in_progress: { label: "In Progress", color: "bg-blue-500" },
  completed: { label: "Completed", color: "bg-green-500" },
  canceled: { label: "Canceled", color: "bg-red-500" },
};

export default function BookingDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading, refetch, isError } = useRoadsideServiceDetailsQuery(
    params.id
  );
  const [updateStatus] = useRoadsideStatusUpdateMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [generateQuotation] = useGenerateQuotationMutation();


  const handleNavigate = () => {
    console.log("Navigate to customer location");
  };

    useEffect(()=>{
      const socket = initSocket();
      socket.on('roadside_assistance_changed',()=>{
        refetch()
      })
    },[])

  const handleStatusChange = async (bookingId: string,status: RoadsideStatusMech ) => {
    try {
      await updateStatus({ bookingId, status }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update status to on_the_way", error);
    }
  };

  const onQuotationSubmit = async (data: QuotationData) => {
    const items = data.items.map((item) => ({
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));
    try {
      await generateQuotation({
        bookingId:params.id,
        items,
        note: data.notes,
        total: data.totalAmount,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update status to on_the_way", error);
    }
  };

  if (isLoading) {
    return <BookingDetailsShimmer />;
  }

  if (isError) {
    navigate("/mechanic/404");
    return null;
  }

  const booking = data?.data;

  return (
    <div className="min-h-screen">
      <div className="px-4 py-6 sm:px-6 max-w-6xl mx-auto">
        {/* Back Button with Text */}
        <div className="mb-6 flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 focus:outline-none"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm text-gray-600">Back</span>
        </div>

        {/* Status Badge and Refetch Button */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="flex items-center space-x-1 focus:outline-none"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Badge
            className={`${
              statusConfig[booking.status as BookingStatus].color
            } text-white`}
          >
            {statusConfig[booking.status as BookingStatus].label}
          </Badge>
        </div>

        {/* Customer & Vehicle Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-gray-900 text-sm font-medium">
                <User className="h-4 w-4 text-blue-600 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Name</span>
                  <span className="font-medium text-gray-900">
                    {booking.user.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="font-medium text-gray-900 truncate ml-2">
                    {booking.user.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Mobile</span>
                  <span className="font-medium text-gray-900">
                    {booking.user.mobile}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleNavigate}
                className="w-full bg-blue-600 hover:bg-blue-700 mt-4 h-9 focus:outline-none"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Navigate to Location
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-gray-900 text-sm font-medium">
                <Car className="h-4 w-4 text-green-600 mr-2" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Registration</span>
                  <span className="font-medium text-gray-900">
                    {booking.vehicle.regNo}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Brand</span>
                  <span className="font-medium text-gray-900">
                    {booking.vehicle.brand}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Model</span>
                  <span className="font-medium text-gray-900">
                    {booking.vehicle.modelName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Owner</span>
                  <span className="font-medium text-gray-900">
                    {booking.vehicle.owner}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issue Details */}
        <Card className="shadow-sm border-0 bg-white mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-gray-900 text-base">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                Reported Issue
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {booking.issue}
              </h3>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {booking.description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Booking Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {booking.endedAt && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="h-4 w-4 text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Completed Time</p>
                    <p className="font-medium text-gray-900">
                      {new Date(booking.endedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="shadow-sm border-0 bg-white mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-gray-900 text-base">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="h-4 w-4 text-purple-600" />
              </div>
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!booking.paymentId ? (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Payment Not Completed
                    </p>
                    <p className="text-yellow-700 text-sm mt-1">
                      Customer has not made the payment yet.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                    <span className="font-medium text-green-600">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* When status is 'assigned', show Start Work button */}
          {booking.status === "assigned" && (
            <Button
              onClick={() => handleStatusChange(booking._id, "on_the_way")}
              className="w-full bg-blue-600 hover:bg-blue-700 h-10 focus:outline-none"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Start Work
            </Button>
          )}

          {/* When status is 'on_the_way', show Arrived button */}
          {booking.status === "on_the_way" && (
            <Button
              onClick={() => handleStatusChange(booking._id, "analysing")}
              className="w-full bg-blue-600 hover:bg-blue-700 h-10 focus:outline-none"
            >
              Arrived
            </Button>
          )}

          {/* When status is 'analysing', show Generate Quotation button */}
          {booking.status === "analysing" && (
            <>
              <QuotationModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSubmit={onQuotationSubmit}
              />
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 h-10 focus:outline-none"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Generate Quotation
              </Button>
            </>
          )}

          {/* When status is 'quotation_sent', show waiting message */}
          {booking.status === "quotation_sent" && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-800 font-medium">
                Waiting for customer approval and payment
              </p>
            </div>
          )}

          {/* When status is 'in_progress', show Complete Job button */}
          {booking.status === "in_progress" && (
            <Button
              onClick={() => handleStatusChange(booking._id,'completed')}
              className="w-full bg-green-600 hover:bg-green-700 h-10 focus:outline-none"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Complete Job
            </Button>
          )}

          {/* When status is 'completed', show success message */}
          {booking.status === "completed" && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCheck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">
                    Job Completed Successfully
                  </p>
                  <p className="text-green-700 text-sm">
                    Service has been marked as completed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* When status is 'canceled', show canceled message */}
          {booking.status === "canceled" && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-800 font-medium">Job Canceled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
