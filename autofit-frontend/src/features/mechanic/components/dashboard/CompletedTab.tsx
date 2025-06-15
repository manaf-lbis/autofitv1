import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car,
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  Navigation,
  User,
} from "lucide-react";
import React from "react";

const completedJobs = [
  {
    id: 1,
    name: "John Smith",
    vehicle: "Nissan Altima 2019",
    issue: "Battery replacement",
    completedTime: "Completed 30m ago",
    location: "Customer Location",
  },
  {
    id: 2,
    name: "Emma Taylor",
    vehicle: "Chevrolet Malibu 2020",
    issue: "Oil change and filter",
    completedTime: "Completed 1h ago",
    location: "Customer Location",
  },
];

const CompletedTab = () => {
  return (
    <>
      
      <div className="space-y-4 lg:space-y-6">
        <h3 className="font-bold text-gray-900 text-lg lg:text-xl">
          Completed Today
        </h3>
        <div className="space-y-4">
          {completedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-green-50 border-2 border-green-200 rounded-lg p-4 lg:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3 lg:mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-600" />
                    <h4 className="font-bold text-gray-900 text-sm lg:text-base">
                      {job.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                    <p className="text-gray-600 text-xs lg:text-sm">
                      {job.vehicle}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white text-xs self-start">
                  Completed
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="font-medium text-gray-900 text-sm lg:text-base">
                  {job.issue}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-6 text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{job.completedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                <Button
                  size="sm"
                  //   onClick={() => handleNavigate(job.location)}
                  className="bg-green-500 hover:bg-green-600 text-sm lg:text-base"
                >
                  <Navigation className="w-4 h-4 mr-1 lg:mr-2" />
                  Navigate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-sm lg:text-base"
                >
                  Start Return
                  <ChevronRight className="w-4 h-4 ml-1 lg:ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
};

export default CompletedTab;
