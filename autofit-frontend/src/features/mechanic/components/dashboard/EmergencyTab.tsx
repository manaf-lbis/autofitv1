import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CarFront,
  ChevronRight,
  Clock,
  MapPin,
  Navigation,
  Search,
  User,
} from "lucide-react";
import React from "react";
import LatLngToAddress from "@/components/shared/LocationInput/LatLngToAddress";
import { formatTimeToNow } from "@/lib/dateFormater";
import { useNavigate } from "react-router-dom";
import MapModal from "../MapModal";
import { useGeolocation } from "@/hooks/useGeolocation";

export interface EmergencyRequest {
  _id: string;
  name: string;
  issue: string;
  description: string;
  location: [number, number];
  time: string;
  status: string;
  vehicle: string
}

export interface EmergencyTabProps {
  emergencyRequest: EmergencyRequest | null;
}

const EmergencyTab: React.FC<EmergencyTabProps> = ({ emergencyRequest }) => {
  const navigate = useNavigate()
    const geo = useGeolocation();
  const [isNavModalOpen, setIsNavModalOpen] = React.useState(false);

  if (!emergencyRequest) {
    return <>
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 lg:p-6 flex items-center justify-center">
        <div className="flex items-center justify-center gap-3  text-blue-500 h-full">
          <Search className="w-5 h-5 lg:w-6 lg:h-6 " />
          No Request Available
        </div>
      </div>
    </>
  }

  return (
    <>
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">

            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-gray-600" />
                <h3 className="font-bold text-gray-900 text-sm lg:text-lg">
                  {emergencyRequest.name}
                </h3>
              </div>
              <div className="flex gap-2 ">
                <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
                <p className="text-red-600 font-medium text-sm lg:text-base">
                  {emergencyRequest.issue}
                </p>
              </div>

            </div>
          </div>
          <Badge className="bg-red-500 text-white text-xs self-start">
            URGENT
          </Badge>
        </div>

        <p className="text-gray-700 mb-4 text-sm lg:text-base">
          {emergencyRequest.description}
        </p>

        <div className="space-y-2 mb-4 lg:mb-6">
          <div className="flex items-center gap-2">
            <CarFront className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 text-sm lg:text-base">
              {emergencyRequest.vehicle}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 text-sm lg:text-base">
              <LatLngToAddress lat={emergencyRequest.location[1]} lng={emergencyRequest.location[0]} />
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs lg:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
              <span>{formatTimeToNow(emergencyRequest.time)}</span>
            </div>
            <span>•</span>
            <span>{emergencyRequest.status}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
          <Button
            onClick={() =>setIsNavModalOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white text-sm lg:text-base"
            size="sm"
          >
            <Navigation className="w-4 h-4 mr-1 lg:mr-2" />
            Navigate
          </Button>
          <Button onClick={() => navigate(`/mechanic/roadside-assistance/${emergencyRequest._id}/details`)} variant="outline" size="sm" className="text-sm lg:text-base">
            Details
            <ChevronRight className="w-4 h-4 ml-1 lg:ml-2" />
          </Button>
        </div>
      </div>
      <MapModal
        isOpen={isNavModalOpen}
        onClose={() => setIsNavModalOpen(false)}
        startLat={geo.latitude!}
        startLng={geo.longitude!}
        endLat={emergencyRequest.location[1]}
        endLng={emergencyRequest.location[0]}
        error={geo.error}
      />
    </>
  );
};

export default EmergencyTab;
