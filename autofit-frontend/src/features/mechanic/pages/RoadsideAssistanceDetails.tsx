import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MapModal from "../components/MapModal";
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
  Loader2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { RoadsideStatusMech,useGenerateQuotationMutation,useRoadsideServiceDetailsQuery,useRoadsideStatusUpdateMutation } from "../api/roadsideApi";
import BookingDetailsShimmer from "../components/shimmer/BookingDetailsShimmer";
import QuotationModal, { QuotationData } from "../components/service/QuotationModal";
import { initSocket } from "@/lib/socket";
import { useGeolocation } from "@/hooks/useGeolocation";

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
  const { data, isLoading, refetch, isError } = useRoadsideServiceDetailsQuery(params.id);
  const [updateStatus, { isLoading: isUpdating }] = useRoadsideStatusUpdateMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [generateQuotation] = useGenerateQuotationMutation();
  const [isNavModalOpen, setIsNavModalOpen] = useState<boolean>(false);
  const socket = useRef<ReturnType<typeof initSocket> | null>(null);
  const { latitude, longitude, error } = useGeolocation();

  useEffect(() => {
    socket.current = initSocket();
    socket.current.on("roadside_assistance_changed", () => {
      refetch();
    });

    return () => {
      socket.current?.off("roadside_assistance_changed")
    };
  }, []);

  useEffect(() => {
    socket.current?.emit("joinRoom", { room: `live_tracking_${params.id}`})

    const handleLocationUpdate = () => {
      if (latitude && longitude && socket.current) {
        socket.current.emit("mechanicLocationUpdate", { bookingId: params.id, latitude, longitude });
      } else if (error) {
        console.warn("Geolocation error:", error);
      }
    };

    const locationInterval = setInterval(handleLocationUpdate, 3000);

    return () => {
      clearInterval(locationInterval);
      socket.current?.emit("leaveRoom", { room: params.id });
    };
  }, [params.id, latitude, longitude, error]);


  const handleStatusChange = async (bookingId: string, status: RoadsideStatusMech) => {
    try {
      await updateStatus({ bookingId, status }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update status", error);
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
        bookingId: params.id,
        items,
        note: data.notes,
        total: data.totalAmount,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to generate quotation", error);
    }
  };

  const handleNavigate = () => {
    if (data?.data.status === "assigned") {
      handleStatusChange(data.data._id, "on_the_way");
    }
    setIsNavModalOpen(!isNavModalOpen);
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
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="focus:outline-none"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm text-gray-600">Back</span>
      </div>

      {/* Status Badge and Refresh */}
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
        <Badge className={`${statusConfig[booking.status as BookingStatus].color} text-white`}>
          {statusConfig[booking.status as BookingStatus].label}
        </Badge>
      </div>

      {/* Customer & Vehicle Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-gray-900">
              <User className="h-4 w-4 text-blue-600 mr-2" />
              Customer Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Name</span>
                <span className="font-medium text-gray-900">{booking.user.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Email</span>
                <span className="font-medium text-gray-900">{booking.user.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Mobile</span>
                <span className="font-medium text-gray-900">{booking.user.mobile}</span>
              </div>
            </div>
            {booking.status === "assigned" || booking.status === "on_the_way" && (
              <Button
                onClick={handleNavigate}
                className="w-full bg-blue-600 hover:bg-blue-700 mt-4 h-9 focus:outline-none"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Start Navigate
              </Button>
            )}
            <MapModal
              isOpen={isNavModalOpen}
              onClose={handleNavigate}
              startLat={latitude|| 9.001020 }
              startLng={longitude || 76.535293}
              endLat={ booking.serviceLocation.coordinates[1] || 8.994086}
              endLng={booking.serviceLocation.coordinates[0] || 76.559832}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-gray-900">
              <Car className="h-4 w-4 text-green-600 mr-2" />
              Vehicle Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Registration</span>
                <span className="font-medium text-gray-900">{booking.vehicle.regNo}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Brand</span>
                <span className="font-medium text-gray-900">{booking.vehicle.brand}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Model</span>
                <span className="font-medium text-gray-900">{booking.vehicle.modelName}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Owner</span>
                <span className="font-medium text-gray-900">{booking.vehicle.owner}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Details */}
      <Card className="shadow-sm border-0 bg-white mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-base text-gray-900">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            Reported Issue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{booking.issue}</h3>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <p className="text-gray-700">{booking.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Booking Time</p>
                  <p className="font-medium text-gray-900">{new Date(booking.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {booking.endedAt && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Completed Time</p>
                    <p className="font-medium text-gray-900">{new Date(booking.endedAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card className="shadow-sm border-0 bg-white mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-base text-gray-900">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <CreditCard className="h-4 w-4 text-purple-600" />
            </div>
            Payment Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!booking.paymentId ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Payment Not Completed</p>
                  <p className="text-yellow-700 text-sm mt-1">Customer has not made the payment yet.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Payment Status</span>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                <span className="font-medium text-green-600">Completed</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        {booking.status === "assigned" && (
          <>
            <Button
              onClick={handleNavigate}
              className="w-full bg-blue-600 hover:bg-blue-700 h-10 focus:outline-none"
              disabled={isUpdating}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Start Navigate
            </Button>
            <Button
              onClick={() => handleStatusChange(booking._id, "on_the_way")}
              className="w-full bg-blue-600 hover:bg-blue-700 h-10 focus:outline-none"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>Start Work</>
              )}
            </Button>
          </>
        )}

        {booking.status === "on_the_way" && (
          <Button
            onClick={() => handleStatusChange(booking._id, "analysing")}
            className="w-full bg-blue-600 hover:bg-blue-700 h-10 focus:outline-none"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>Arrived</>
            )}
          </Button>
        )}

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

        {booking.status === "quotation_sent" && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-yellow-800 font-medium">Waiting for approval</p>
          </div>
        )}

        {booking.status === "in_progress" && (
          <Button
            onClick={() => handleStatusChange(booking._id, "completed")}
            className="w-full bg-green-600 hover:bg-green-700 h-10 focus:outline-none"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <CheckCheck className="h-4 w-4 mr-2" />
                Complete Job
              </>
            )}
          </Button>
        )}

        {booking.status === "completed" && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCheck className="h-5 w-5 text-green-600" />
              <p className="font-medium text-green-800">Job Completed</p>
            </div>
          </div>
        )}

        {booking.status === "canceled" && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-800 font-medium">Job Canceled</p>
          </div>
        )}
      </div>
    </div>
  );
}
