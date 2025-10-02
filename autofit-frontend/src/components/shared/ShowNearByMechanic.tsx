import React, { useState, useEffect, Component } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Clock, MapPin, Phone, Star, Wrench, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useGetNearByMechanicQuery } from "@/services/userServices/servicesApi";
import LazyImage from "./LazyImage";
import { ReviewListingModal } from "./rating/ReviewListingModal";

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
  rating: {
    avg: number;
    reviews: number
  },
  mobile: string;
  status: string;
  distanceInMeters: number;
  durationInSeconds: number;
}

interface MechanicWithDistance {
  mechanicId: string;
  name: string;
  rating: {
    avg: number;
    reviews: number;
  };
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
      return <p className="text-red-600 text-sm p-4 text-center">Something went wrong. Please try again.</p>;
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
  const [, setRefetchKey] = useState<number>(0);

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
          rating: {
            avg: mechanic?.rating?.avg,
            reviews: mechanic?.rating?.reviews,
          },
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
      <Card className="bg-white shadow-sm border-0 rounded-lg mb-6 sm:mb-8 sm:mx-0">
        <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-green-600" />
            </div>
            Nearby Mechanics
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="pb-4 border-b">
            <Button
              onClick={findNearbyMechanics}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
              disabled={isLoading || isFetching}
            >
              {isLoading || isFetching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4 mr-2" />
                  Find Mechanics Nearby
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3 mt-4 max-h-80 overflow-y-auto">
            {isLoading && (
              <div className="text-center py-6">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600 text-sm">Finding mechanics...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-4">
                <p className="text-red-600 text-sm">Failed to load mechanics. Try again.</p>
              </div>
            )}

            {!isLoading && !error && mechanicsWithDistance.length === 0 && (
              <div className="text-center py-6">
                <Wrench className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No mechanics found nearby</p>
              </div>
            )}

            {mechanicsWithDistance.map((mechanic) => (
              <div
                key={mechanic.mechanicId}
                onClick={() => mechanic.available && handleMechanicSelect(mechanic.mechanicId)}
                className={`p-5 sm:p-6 rounded-lg border-2 cursor-pointer transition-all ${selectedMechanic === mechanic.mechanicId
                  ? "border-blue-400 bg-blue-50/50"
                  : "border-gray-100 bg-gray-50 hover:border-gray-200"
                  } ${!mechanic.available ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {selectedMechanic === mechanic.mechanicId && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 fill-current" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <LazyImage
                    publicId={mechanic.avatar}
                    resourceType="image"
                    alt={mechanic.name}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {mechanic.name}
                          </h3>
                          <ReviewListingModal
                            mechanic={{
                              id: mechanic.mechanicId,
                              avatarUrl: mechanic.avatar,
                              averageRating: mechanic?.rating?.avg ?? 0,
                              name: mechanic.name,
                              reviewsCount: mechanic?.rating?.reviews ?? 0
                            }}
                            triggerClassName="w-4 h-4 text-blue-500"
                          />
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-600">{mechanic?.rating?.avg?.toFixed(1) || 0} ({mechanic?.rating?.reviews} Reviews)</span>
                          </div>
                          {mechanic.available ? (
                            <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5 h-auto hover:bg-green-200">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs px-2 py-0.5 h-auto">
                              Busy
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex flex-col gap-1 text-xs text-right">
                        <div className="flex items-center gap-1 text-green-600">
                          <MapPin className="w-3 h-3" />
                          <span className="font-medium">{mechanic.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="w-3 h-3" />
                          <span className="font-medium">{mechanic.responseTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 line-clamp-1">{mechanic.address}</p>
                      <div className="flex items-center justify-between">
                        <span className="bg-white px-2 py-1 rounded text-xs text-gray-700 border">
                          {mechanic.specialised}
                        </span>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Phone className="w-3 h-3" />
                          <span className="text-xs font-medium">{mechanic.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default ShowNearByMechanic;