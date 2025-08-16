import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  ChevronRight,
  Clock,
  MapPin,
  Navigation,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { formatTime } from "@/utils/utilityFunctions/dateUtils";
import LatLngToAddress from "@/components/shared/LocationInput/LatLngToAddress";
import { useGeolocation } from "@/hooks/useGeolocation";
import MapModal from "../MapModal";
import { useNavigate } from "react-router-dom";



interface Props {
  refetch: () => void;
  workCompleted: any
}

const CompletedTab: React.FC<Props> = ({ refetch, workCompleted }) => {
  const [modalOpen,setModalOpen] = useState<boolean>(false);
  const {error,latitude,longitude} = useGeolocation();
  const navigate = useNavigate()
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null >(null);

  const handleNavigate = (coords: [number, number]) => {
    setSelectedLocation(coords);
    setModalOpen(true);
  };


  if (!workCompleted || workCompleted.length === 0) {
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
          Completed Today
        </h3>
        <div className="space-y-4">
          {workCompleted.map((job:any) => (
            <div
              key={job._id}
              className="bg-green-50 border-2 border-green-200 rounded-lg p-4 lg:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3 lg:mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-600" />
                    <h4 className="font-bold text-gray-900 text-sm lg:text-base">
                      {job.userId.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                    <p className="text-gray-600 text-xs lg:text-sm">
                      {`${job.vehicleId.brand} ${job.vehicleId.modelName} (${job.vehicleId.regNo})`}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white text-xs self-start">
                  Completed
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-6 text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {`${formatTime(new Date(job.schedule.start))} - ${formatTime(new Date(job.schedule.end))}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    <LatLngToAddress lat={job.pickupLocation.coordinates[1]} lng={job.pickupLocation.coordinates[0]} />
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <Button
                  size="sm"
                  onClick={() => handleNavigate(job.pickupLocation.coordinates)}
                  className="bg-green-500 hover:bg-green-600 text-sm lg:text-base"
                >
                  <Navigation className="w-4 h-4 mr-1 lg:mr-2" />
                  Navigate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm lg:text-base"
                  onClick={()=>navigate(`/mechanic/pre-trip-checkup/${job._id}/details`)}
                >
                  Start Return
                  <ChevronRight className="w-4 h-4 ml-1 lg:ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>


      <MapModal 
       startLat={latitude!}
       startLng={longitude!}
       endLng={selectedLocation ? selectedLocation[0] : 0}
       endLat={selectedLocation ? selectedLocation[1] : 0}
       error={error}
       isOpen={modalOpen}
       onClose={() => setModalOpen(false)}
      />

    </>
  );
};

export default CompletedTab;
