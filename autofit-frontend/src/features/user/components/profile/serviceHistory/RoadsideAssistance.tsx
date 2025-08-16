import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Truck,
  Wrench,
  AlertCircle,
  Play,
  ChevronRight,
  Car,
  Loader2,
} from "lucide-react";
import { useServiceHistoryQuery } from "@/services/userServices/profileApi";
import { useNavigate } from "react-router-dom";

type RoadsideStatus =
  | "assigned"
  | "on_the_way"
  | "analysing"
  | "quotation_sent"
  | "in_progress"
  | "completed"
  | "canceled";

const getStatusIcon = (status: RoadsideStatus) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "in_progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "on_the_way":
      return <Truck className="h-4 w-4 text-indigo-500" />;
    case "analysing":
      return <Wrench className="h-4 w-4 text-orange-500" />;
    case "quotation_sent":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "assigned":
      return <Play className="h-4 w-4 text-gray-500" />;
    case "canceled":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-red-500" />;
  }
};

const getStatusColor = (status: RoadsideStatus) => {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "in_progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "on_the_way":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "analysing":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "quotation_sent":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "assigned":
      return "bg-gray-50 text-gray-700 border-gray-200";
    case "canceled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const formatStatus = (status: RoadsideStatus) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

export default function RoadsideAssistance() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, isFetching } = useServiceHistoryQuery({ page });

  const history = data?.history ?? [];
  const hasMore = data?.hasMore ?? false;

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetching) {
        setPage((prev) => prev + 1);
      }
    });

    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetching]);

  const handleViewDetails = (requestId: string) => {
    navigate(`/user/roadside-assistance/${requestId}/details`);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {history.map((request: any) => {
        const startTime = request.startedAt
          ? formatDateTime(request.startedAt)
          : null;
        const endTime = request.endedAt
          ? formatDateTime(request.endedAt)
          : null;

        return (
          <Card
            key={request._id}
            className="border border-gray-200 hover:shadow-md transition-all duration-200 bg-white rounded-lg"
            onClick={() => handleViewDetails(request._id)}
          >
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(request.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                        {request.issue}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                        {request.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-xs sm:text-sm">
                    <Car className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 min-w-0">
                      <span className="text-gray-900 font-medium">
                        {request.vehicle.brand} {request.vehicle.modelName}
                      </span>
                      <span className="text-gray-400 hidden xs:inline">•</span>
                      <span className="text-gray-600">
                        {request.vehicle.regNo}
                      </span>
                      <span className="text-gray-400 hidden sm:inline">•</span>
                      <span className="text-gray-600 truncate hidden sm:inline">
                        {request.vehicle.owner}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 lg:gap-6 text-xs text-gray-500">
                    {startTime && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">
                          Started:
                        </span>
                        <span className="text-xs">
                          {startTime.date} at {startTime.time}
                        </span>
                      </div>
                    )}
                    {endTime && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">
                          Ended:
                        </span>
                        <span className="text-xs">
                          {endTime.date} at {endTime.time}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-3 flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium px-2 py-1 rounded-md ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {formatStatus(request.status)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 rounded-md flex-shrink-0"
                  >
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Loader trigger element for IntersectionObserver */}
      <div ref={loaderRef} />

      {isFetching && (
        <div className="flex items-center justify-center py-6 sm:py-8">
          <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-xs sm:text-sm text-gray-600">
            Loading more requests...
          </span>
        </div>
      )}

      {!hasMore && history.length > 0 && (
        <div className="text-center py-6 sm:py-8">
          <p className="text-xs sm:text-sm text-gray-500">
            No more requests to load
          </p>
        </div>
      )}
    </div>
  );
}
