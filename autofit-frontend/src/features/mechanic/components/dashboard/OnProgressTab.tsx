import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, ChevronRight, Clock, Eye, User } from "lucide-react";
import React from "react";
import { formatTime } from "@/utils/utilityFunctions/dateUtils";
import { useNavigate } from "react-router-dom";

interface Work {
  _id: string;
  schedule: { start: string; end: string };
  status: "analysing" | "report_created";
  userId: { _id: string; name: string };
  vehicleId: { _id: string; regNo: string; brand: string; modelName: string };
}

interface Props {
  refetch: () => void;
  workInProgress: Work[];
}

const OnProgressTab: React.FC<Props> = ({ refetch, workInProgress }) => {
  const navigate = useNavigate();
  const getStatusDisplay = (status: Work["status"]) => {
    return status === "analysing" ? "Analysing" : "Report Created";
  };

  const getButtonText = (status: Work["status"]) => {
    return status === "analysing" ? "Analyse and Create Report" : "Mark as Complete";
  };

  return (
    <div className="space-y-6 p-4">
      <h3 className="font-bold text-gray-900 text-lg lg:text-xl">Active Jobs</h3>
      {(!workInProgress || workInProgress.length === 0) ? (
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
      ) : (
        <div className="space-y-4">
          {workInProgress.map((work) => (
            <div
              key={work._id}
              className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 lg:p-6 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <h4 className="font-semibold text-gray-900 text-sm lg:text-base">
                      {work.userId.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-600 text-xs lg:text-sm">
                      {`${work.vehicleId.brand} ${work.vehicleId.modelName} (${work.vehicleId.regNo})`}
                    </p>
                  </div>
                </div>
                <Badge className="bg-orange-500 text-white text-xs self-start capitalize">
                  {getStatusDisplay(work.status)}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-4 text-xs lg:text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {`${formatTime(new Date(work.schedule.start))} - ${formatTime(new Date(work.schedule.end))}`}
                </span>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto text-sm lg:text-base"
                   onClick={() =>
                    navigate(
                      `/mechanic/pre-trip-checkup/${work._id}/details`
                    )
                  }
                aria-label={getButtonText(work.status)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {getButtonText(work.status)}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnProgressTab;