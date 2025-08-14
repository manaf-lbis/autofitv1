import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Navigation, Car, CreditCard, ArrowLeft, Calendar, RefreshCw, FileText, CheckCircle } from "lucide-react";
import { PretripReportModal } from "../components/jobs/PretripReportModal";
import { useNavigate, useParams } from "react-router-dom";
import { usePretripDetailsQuery, useUpdatePretripStatusMutation } from "@/services/mechanicServices/pretripMechanicApi";
import { useGeolocation } from "@/hooks/useGeolocation";
import MapModal from "../components/MapModal";
import { PretripStatus } from "@/types/pretrip";
import { formatTime } from "@/utils/utilityFunctions/dateUtils";
import toast from "react-hot-toast";

export default function PretripDetails() {
  const [isNavModalOpen, setIsNavModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const params = useParams();
  const { data, refetch, isLoading } = usePretripDetailsQuery({ id: params.id! });
  const [updatePretripStatus] = useUpdatePretripStatusMutation();
  const geo = useGeolocation();
  const navigate = useNavigate();

  const updateStatus = async (serviceId: string, status: PretripStatus) => {
    try {
      await updatePretripStatus({ serviceId, status }).unwrap();
      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update status");
    }
  };

  const ShimmerCard = () => (
    <Card className="shadow-sm border-0 bg-white animate-pulse">
      <CardHeader className="pb-3">
        <div className="h-5 w-40 bg-gray-200 rounded" />
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="flex justify-between py-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const status = data?.data.status || PretripStatus.COMPLETED;

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="focus:outline-none" aria-label="Go back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm text-gray-600">Back</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="flex items-center space-x-1 bg-transparent"
            aria-label="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Badge className="bg-green-500 text-white">{status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {isLoading ? (
          <>
            <ShimmerCard />
            <ShimmerCard />
          </>
        ) : data ? (
          <>
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-gray-900">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  Customer Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Name</span>
                    <span className="font-medium text-gray-900">{data.data.user.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="font-medium text-gray-900">{data.data.user.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Mobile</span>
                    <span className="font-medium text-gray-900">{data.data.user.mobile}</span>
                  </div>
                </div>
                {[PretripStatus.BOOKED, PretripStatus.COMPLETED, PretripStatus.CANCELLED].includes(status) && (
                  <Button
                    onClick={() => setIsNavModalOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-4 h-9 focus:outline-none"
                    aria-label="Start navigation"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Start Navigate
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-gray-900">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Car className="h-4 w-4 text-green-600" />
                  </div>
                  Vehicle Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Registration</span>
                    <span className="font-medium text-gray-900">{data.data.vehicle.registration}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Brand</span>
                    <span className="font-medium text-gray-900">{data.data.vehicle.brand}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Model</span>
                    <span className="font-medium text-gray-900">{data.data.vehicle.model}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Owner</span>
                    <span className="font-medium text-gray-900">{data.data.vehicle.owner}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {isLoading ? (
        <ShimmerCard />
      ) : data ? (
        <Card className="shadow-sm border-0 bg-white mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-gray-900">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              Service Plan & Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Plan</span>
                <span className="font-medium text-gray-900">{data.data.plan.servicePlan.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Schedule</span>
                <span className="font-medium text-gray-900">{`${formatTime(new Date(data.data.schedule.start))} - ${formatTime(new Date(data.data.schedule.end))}`}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Price</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 line-through">₹{data.data.plan.servicePlan.originalPrice}</span>
                  <span className="font-medium text-gray-900">₹{data.data.plan.servicePlan.price}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {isLoading ? (
        <ShimmerCard />
      ) : data ? (
        <Card className="shadow-sm border-0 bg-white mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-gray-900">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              Payment Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Payment ID</span>
                <span className="font-medium text-gray-900">{data.data.service.paymentId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Mode</span>
                <span className="font-medium text-gray-900 capitalize">{data.data.service.method}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="font-medium text-gray-900">₹{data.data.service.amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex justify-end space-x-3">
        {[PretripStatus.ANALYSING, PretripStatus.COMPLETED, PretripStatus.VEHICLE_RETURNED].includes(status) && (
          <Button
            onClick={() => setIsReportModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 h-9 focus:outline-none"
            aria-label={status === PretripStatus.ANALYSING ? "Create inspection report" : "View inspection report"}
          >
            <FileText className="h-4 w-4 mr-2" />
            {status === PretripStatus.ANALYSING ? "Create" : "View"}
          </Button>
        )}
        {status === PretripStatus.REPORT_CREATED && data && (
          <Button
            className="bg-green-600 hover:bg-green-700 h-9 focus:outline-none"
            aria-label="Mark as complete"
            onClick={() => updateStatus(data.data.serviceId, PretripStatus.COMPLETED)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete
          </Button>
        )}
        {status === PretripStatus.COMPLETED && data && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 h-9 focus:outline-none"
            aria-label="Vehicle return completed"
            onClick={() => updateStatus(data.data.serviceId, PretripStatus.VEHICLE_RETURNED)}
          >
            <Car className="h-4 w-4 mr-2" />
            Return
          </Button>
        )}
        {status === PretripStatus.VEHICLE_RETURNED && (
          <div className="text-green-600 font-medium flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Work Completed
          </div>
        )}
      </div>

      {data && (
        <PretripReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          bookingData={{
            serviceId: data.data.serviceId,
            vehicle: data.data.vehicle,
            plan: {
              name: data.data.plan.servicePlan.name,
              schedule: `${formatTime(new Date(data.data.schedule.start))} - ${formatTime(new Date(data.data.schedule.end))}`,
            },
            reportItems: data.data.plan.reportItems,
            status: data.data.status,
          }}
        />
      )}

      {data && (
        <MapModal
          isOpen={isNavModalOpen}
          onClose={() => setIsNavModalOpen(false)}
          startLat={geo.latitude ?? 0}
          startLng={geo.longitude ?? 0}
          endLat={data.data.serviceLocation?.[1] ?? 0}
          endLng={data.data.serviceLocation?.[0] ?? 0}
          error={geo.error}
        />
      )}
    </div>
  );
}