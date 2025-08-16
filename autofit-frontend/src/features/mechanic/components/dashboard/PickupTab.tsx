import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  User,
} from "lucide-react";
import React, { useState } from "react";
import MapModal from "../MapModal";
import { formatTime } from "@/utils/utilityFunctions/dateUtils";
import { useGeolocation } from "@/hooks/useGeolocation";
import LatLngToAddress from "@/components/shared/LocationInput/LatLngToAddress";
import { useNavigate } from "react-router-dom";
import { useUpdatePretripStatusMutation } from "@/services/mechanicServices/pretripMechanicApi";
import { PretripStatus } from "@/types/pretrip";

interface Props{
  refetch: () => void
  pickupSchedules: any
}

const PickupTab:React.FC<Props> = ({pickupSchedules, refetch}) => {

  const [isNavModalOpen, setIsNavModalOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);

  const navigate = useNavigate();
  const geo = useGeolocation();
  const [updateStatus,{isLoading}] = useUpdatePretripStatusMutation()

  const handleNavigate = (coords: [number, number]) => {
    setSelectedLocation(coords);
    setIsNavModalOpen(true);
  };



  if (!pickupSchedules.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">No active jobs found.</p>
        <Button
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={refetch}
          aria-label="Refresh jobs"
        >
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4 lg:space-y-6">
        <h3 className="font-bold text-gray-900 text-lg lg:text-xl">
          Today's Schedule
        </h3>
        <div className="space-y-4">
          {pickupSchedules.map((request: any) => (
            <div
              key={request._id}
              className="rounded-lg p-4 lg:p-6 bg-blue-50 border-2 border-blue-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3 lg:mb-4">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 lg:px-3 lg:py-1 rounded-md lg:rounded-lg font-medium text-xs lg:text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                    {formatTime(new Date(request.schedule.start))} -{" "}
                    {formatTime(new Date(request.schedule.end))}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-600" />
                      <h4 className="font-bold text-gray-900 text-sm lg:text-base">
                        {request.userId.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                      <p className="text-gray-600 text-xs lg:text-sm">
                        {`${request.vehicleId.brand} ${request.vehicleId.modelName} (${request.vehicleId.regNo})`}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge className="bg-blue-500 text-white text-xs self-start">
                  Scheduled <Check className="w-3 h-3 ml-1" />
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-2 lg:mb-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700 text-xs lg:text-sm">
                  <LatLngToAddress
                    lat={request.pickupLocation.coordinates[1]}
                    lng={request.pickupLocation.coordinates[0]}
                  />
                </span>
              </div>

              <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">
                {request?.serviceReportId?.servicePlan?.name ?? 'Service Plan'} checkup
              </p>
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    onClick={() =>
                      handleNavigate(
                        request.pickupLocation.coordinates as [number, number]
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-sm lg:text-base w-1/2 sm:w-auto"
                  >
                    <Navigation className="w-4 h-4 mr-1 lg:mr-2" />
                    Navigate
                  </Button>

                  <Button
                     disabled={isLoading}
                    size="sm"
                    onClick={async () =>{
                       await updateStatus({serviceId: request._id,status:PretripStatus.ANALYSING})
                       refetch()
                      }}
                    className="bg-green-500 hover:bg-green-600 text-sm lg:text-base w-1/2 sm:w-auto"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 mr-1 lg:mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1 lg:mr-2" />}
                    Pickup Completed
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm lg:text-base w-full sm:w-auto"
                  onClick={() =>
                    navigate(
                      `/mechanic/pre-trip-checkup/${request._id}/details`
                    )
                  }
                >
                  Details
                  <ChevronRight className="w-4 h-4 ml-1 lg:ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <MapModal
          isOpen={isNavModalOpen}
          onClose={() => setIsNavModalOpen(false)}
          startLat={geo.latitude!}
          startLng={geo.longitude!}
          endLat={selectedLocation ? selectedLocation[1] : 8.994086}
          endLng={selectedLocation ? selectedLocation[0] : 76.559832}
          error={geo.error}
        />
      </div>
    </>
  );
};

export default PickupTab;
