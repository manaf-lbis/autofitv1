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
  Receipt,
  FileText,
  MapPin,
  DollarSign,
  Timer,
  Star,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { RoadsideStatusMech,useGenerateQuotationMutation,useRoadsideServiceDetailsQuery,useRoadsideStatusUpdateMutation } from "../../../services/mechanicServices/roadsideApi";
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
  }, [refetch]);

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
      setIsModalOpen(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return <BookingDetailsShimmer />;
  }

  if (isError) {
    navigate("/mechanic/404");
    return null;
  }

  const booking = data?.data;

  // Timeline data
  const timelineEvents = [
    { label: "Booking Created", time: booking.createdAt, icon: Calendar, color: "bg-gray-500" },
    ...(booking.arrivedAt ? [{ label: "Arrived at Location", time: booking.arrivedAt, icon: MapPin, color: "bg-orange-500" }] : []),
    ...(booking.startedAt ? [{ label: "Work Started", time: booking.startedAt, icon: Timer, color: "bg-blue-500" }] : []),
    ...(booking.endedAt ? [{ label: "Work Completed", time: booking.endedAt, icon: CheckCircle, color: "bg-green-500" }] : []),
  ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

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
            {(booking.status === "assigned" || booking.status === "on_the_way") && (
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
              error={error}
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
                  <p className="font-medium text-gray-900">{formatDate(booking.createdAt)}</p>
                </div>
              </div>
              {booking.endedAt && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Total Duration</p>
                    <p className="font-medium text-gray-900">
                      {calculateDuration(booking.createdAt, booking.endedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline - Show only if work is in progress or completed */}
      {(booking.status === "in_progress" || booking.status === "completed") && (
        <Card className="shadow-sm border-0 bg-white mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-base text-gray-900">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Timer className="h-4 w-4 text-blue-600" />
              </div>
              Service Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {timelineEvents.map((event, index) => {
                const IconComponent = event.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 ${event.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      {index < timelineEvents.length - 1 && (
                        <div className="w-px h-6 bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{event.label}</p>
                      <p className="text-sm text-gray-500">{formatDate(event.time)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quotation Details - Show if quotation exists */}
      {booking.quotationId && (
        <Card className="shadow-sm border-0 bg-white mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-base text-gray-900">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              Service Quotation
              <Badge className={`ml-2 ${booking.quotationId.status === 'approved' ? 'bg-green-500' : booking.quotationId.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'} text-white`}>
                {booking.quotationId.status.charAt(0).toUpperCase() + booking.quotationId.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Items & Services</h4>
                <div className="space-y-3">
                  {booking.quotationId.items.map((item: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">x {item.quantity}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            ₹{item.price} per unit
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₹{item.price * item.quantity}</div>
                          <div className="text-xs text-gray-500">Subtotal</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 mt-4 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                    <span className="font-semibold text-gray-900 text-lg">Total Amount</span>
                    <span className="font-bold text-xl text-blue-600">₹{booking.quotationId.total}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Generated on: {formatDate(booking.quotationId.createdAt)}</span>
                {booking.quotationId.status === 'approved' && (
                  <span className="text-green-600">✓ Approved by customer</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Payment Details */}
      <Card className="shadow-sm border-0 bg-white mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-base text-gray-900">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!booking.paymentId ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Payment Pending</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    {booking.quotationId ? 
                      `Waiting for payment of ₹${booking.quotationId.total}` : 
                      "Customer has not made the payment yet."
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-green-800">Payment Successful</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Amount
                    </span>
                    <span className="font-semibold text-gray-900">₹{booking.paymentId.amount}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Method</span>
                    <span className="font-medium text-gray-900 capitalize">{booking.paymentId.method}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className="bg-green-500 text-white">Success</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center">
                      <Receipt className="h-4 w-4 mr-1" />
                      Payment ID
                    </span>
                    <span className="font-mono text-sm text-gray-900">{booking.paymentId.paymentId}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Receipt</span>
                    <span className="font-mono text-sm text-gray-900">{booking.paymentId.receipt}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Payment Date</span>
                    <span className="text-sm text-gray-900">{formatDate(booking.paymentId.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Summary for Completed Work */}
      {booking.status === "completed" && (
        <Card className="shadow-sm border-0 bg-white mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-base text-gray-900">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              Job Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">{booking.quotationId?.items.length || 0}</div>
                <div className="text-sm text-gray-600">Items Serviced</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {booking.startedAt && booking.endedAt ? 
                    calculateDuration(booking.startedAt, booking.endedAt) : '-'
                  }
                </div>
                <div className="text-sm text-gray-600">Work Duration</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-600">₹{booking.paymentId?.amount || 0}</div>
                <div className="text-sm text-gray-600">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800 font-medium">Waiting for customer approval</p>
            </div>
            <p className="text-sm text-yellow-700 mt-1">The quotation has been sent to the customer for approval.</p>
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
              <div>
                <p className="font-medium text-green-800">Job Completed Successfully!</p>
                <p className="text-sm text-green-700">Service completed on {formatDate(booking.endedAt)}</p>
              </div>
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

