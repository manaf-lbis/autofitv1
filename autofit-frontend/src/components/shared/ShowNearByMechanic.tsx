import React, { useState, useEffect, Component } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Clock, MapPin, Phone, Star, Wrench } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useGetNearByMechanicQuery } from "@/services/userServices/servicesApi";
import LazyImage from "./LazyImage";

interface Mechanic {
  mechanicId: string;
  specialised: string;
  experience: number;
  shopName: string;
  place: string;
  location: {
    coordinates: [number, number];
  };
  photo: string;
  name: string;
  mobile: string;
  status: string;
  distanceInMeters: number;
  durationInSeconds: number;
}

interface MechanicWithDistance {
  mechanicId: string;
  name: string;
  rating: number;
  distance: string;
  responseTime: string;
  specialised: string;
  phone: string;
  address: string;
  available: boolean;
  avatar: string;
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  render() {
    if (this.state.hasError) {
      return <p className="text-red-600">Something went wrong. Please try again.</p>;
    }
    return this.props.children;
  }
}

const ShowNearByMechanic = ({
  lat,
  lng,
  selectedMechanic,
  setSelection,
}: {
  lat: number;
  lng: number;
  selectedMechanic: string;
  setSelection: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [mechanicsWithDistance, setMechanicsWithDistance] = useState<MechanicWithDistance[]>([]);
  const [,setRefetchKey] = useState<number>(0);

  const { data, isLoading, error, refetch, isFetching } = useGetNearByMechanicQuery({
    lat,
    lng,
  });

  useEffect(() => {
    if (data?.data) {
      const formattedMechanics = data.data.map((mechanic: Mechanic) => {
        const durationInMinutes = Math.round(mechanic.durationInSeconds / 60);
        return {
          mechanicId: mechanic.mechanicId,
          name: mechanic.shopName,
          rating: 4.5,
          distance: `${(mechanic.distanceInMeters / 1000).toFixed(1)} km`,
          responseTime: durationInMinutes > 0 ? `${durationInMinutes} min` : `${mechanic.durationInSeconds} sec`,
          specialised: mechanic.specialised,
          phone: `+91 ${mechanic.mobile}`,
          address: mechanic.place,
          available: mechanic.status === "approved",
          avatar: mechanic.photo || "/placeholder.svg?height=60&width=60",
        };
      });
      setMechanicsWithDistance(formattedMechanics);
    } else {
      setMechanicsWithDistance([]);
    }
  }, [data]);

  const findNearbyMechanics = () => {
    setMechanicsWithDistance([]);
    setRefetchKey((prev) => prev + 1);
    refetch();
  };

  const handleMechanicSelect = (mechanicId: string) => {
    setSelection(mechanicId);
  };

  return (
    <ErrorBoundary>
      <Card className="bg-white shadow-sm border-0 rounded-lg mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-green-600" />
            </div>
            Nearby Mechanics
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="pt-4 border-t">
            <Button
              onClick={findNearbyMechanics}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
              disabled={isLoading || isFetching}
            >
              <Wrench className="w-4 h-4 mr-2" />
              {isLoading || isFetching ? "Loading..." : "Find Mechanics Nearby"}
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-4 mt-4">
            {isLoading && <p className="text-gray-600">Loading mechanics...</p>}
            {isFetching && !isLoading && <p className="text-gray-600">Fetching new mechanics...</p>}
            {error && <p className="text-red-600">Error: {error.toString()}</p>}
            {!isLoading && !isFetching && !error && mechanicsWithDistance.length === 0 && (
              <p className="text-gray-600">No mechanics found nearby.</p>
            )}
            {Array.isArray(mechanicsWithDistance) && mechanicsWithDistance.length > 0 && (
              mechanicsWithDistance.map((mechanic) => (
                <div
                  key={mechanic.mechanicId}
                  onClick={() => mechanic.available && handleMechanicSelect(mechanic.mechanicId)}
                  className={`bg-gray-50 p-6 rounded-lg border-2 transition-all cursor-pointer relative ${
                    selectedMechanic === mechanic.mechanicId
                      ? "border-blue-600 bg-blue-50"
                      : "border-transparent hover:border-gray-200"
                  } ${!mechanic.available ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {selectedMechanic === mechanic.mechanicId && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <LazyImage publicId={mechanic.avatar} resourceType="image" alt={mechanic.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-gray-900">{mechanic.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-gray-700">{mechanic.rating}</span>
                          </div>
                          {mechanic.available ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-100 text-red-700">
                              Busy
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600">{mechanic.address}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border">
                            {mechanic.specialised}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 text-sm lg:text-right lg:ml-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{mechanic.distance}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{mechanic.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="font-medium">{mechanic.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default ShowNearByMechanic;