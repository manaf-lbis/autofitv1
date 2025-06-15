import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, ChevronRight, Clock, Eye, MapPin, User, Wrench } from "lucide-react";
import React from "react";


  const workInProgress = [
    {
      id: 1,
      name: "Tom Wilson",
      vehicle: "Ford F-150 2018",
      issue: "Transmission repair",
      startTime: "Started 2h ago",
      location: "Workshop Bay 2",
    },
    {
      id: 2,
      name: "Anna Brown",
      vehicle: "BMW X3 2021",
      issue: "Engine diagnostic",
      startTime: "Started 45m ago",
      location: "Workshop Bay 1",
    },
  ]


const OnProgressTab = () => {
  return (
    <>
    
      <div className="space-y-4 lg:space-y-6">
        <h3 className="font-bold text-gray-900 text-lg lg:text-xl">
          Active Jobs
        </h3>
        <div className="space-y-4">
          {workInProgress.map((work) => (
            <div
              key={work.id}
              className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 lg:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3 lg:mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-600" />
                    <h4 className="font-bold text-gray-900 text-sm lg:text-base">
                      {work.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                    <p className="text-gray-600 text-xs lg:text-sm">
                      {work.vehicle}
                    </p>
                  </div>
                </div>
                <Badge className="bg-orange-500 text-white text-xs self-start">
                  In Progress
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                <Wrench className="w-4 h-4 text-orange-600" />
                <p className="font-medium text-gray-900 text-sm lg:text-base">
                  {work.issue}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-6 text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{work.startTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{work.location}</span>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="text-sm lg:text-base"
              >
                <Eye className="w-4 h-4 mr-1 lg:mr-2" />
                View Details
                <ChevronRight className="w-4 h-4 ml-1 lg:ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default OnProgressTab;
