import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, ChevronRight, Clock, MapPin, Navigation, User } from "lucide-react";
import React from "react";

const pickupRequests = [
    {
      id: 1,
      slot: "9:00 AM",
      name: "Mike Davis",
      vehicle: "Honda Civic 2019",
      location: "123 Main St, Downtown",
      details: "Regular maintenance checkup",
    },
    {
      id: 2,
      slot: "11:00 AM",
      name: "Lisa Chen",
      vehicle: "Toyota Camry 2020",
      location: "456 Oak Ave, Midtown",
      details: "Brake inspection and oil change",
    },
    {
      id: 3,
      slot: "2:00 PM",
      name: "Available",
      vehicle: "",
      location: "",
      details: "",
    },
    {
      id: 4,
      slot: "4:00 PM",
      name: "Available",
      vehicle: "",
      location: "",
      details: "",
    },
  ]

const PickupTab = () => {
  return (
    <>
      <div className="space-y-4 lg:space-y-6">
        <h3 className="font-bold text-gray-900 text-lg lg:text-xl">
          Today's Schedule
        </h3>
        <div className="space-y-4">
          {pickupRequests.map((request) => (
            <div
              key={request.id}
              className={`rounded-lg p-4 lg:p-6 ${
                request.name !== "Available"
                  ? "bg-blue-50 border-2 border-blue-200"
                  : "bg-white border"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3 lg:mb-4">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 lg:px-3 lg:py-1 rounded-md lg:rounded-lg font-medium text-xs lg:text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                    {request.slot}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {request.name !== "Available" && (
                        <User className="w-4 h-4 text-gray-600" />
                      )}
                      <h4 className="font-bold text-gray-900 text-sm lg:text-base">
                        {request.name === "Available"
                          ? "Available Slot"
                          : request.name}
                      </h4>
                    </div>
                    {request.vehicle && (
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                        <p className="text-gray-600 text-xs lg:text-sm">
                          {request.vehicle}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {request.name !== "Available" && (
                  <Badge className="bg-blue-500 text-white text-xs self-start">
                    Scheduled
                  </Badge>
                )}
              </div>

              {request.location && (
                <div className="flex items-center gap-2 mb-2 lg:mb-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 text-xs lg:text-sm">
                    {request.location}
                  </span>
                </div>
              )}

              {request.details && (
                <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">
                  {request.details}
                </p>
              )}

              {request.name !== "Available" && (
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                  <Button
                    size="sm"
                    // onClick={() => handleNavigate(request.location)}
                    className="bg-blue-500 hover:bg-blue-600 text-sm lg:text-base"
                  >
                    <Navigation className="w-4 h-4 mr-1 lg:mr-2" />
                    Navigate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-sm lg:text-base"
                  >
                    Details
                    <ChevronRight className="w-4 h-4 ml-1 lg:ml-2" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PickupTab;
