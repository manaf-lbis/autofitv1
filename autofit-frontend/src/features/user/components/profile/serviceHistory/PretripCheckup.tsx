import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePretripServiceHistoryQuery } from "@/services/userServices/profileApi";
import {
  CheckCircle2,
  ChevronRight,
  Car,
  FileText,
  ClipboardCheck,
  RotateCcw,
  X,
  Loader2,
  Wrench,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type PretripStatus = "booked" | "analysing" | "report_created" | "vehicle_returned" | "cancelled" | "completed";

interface Vehicle {
  regNo: string;
  brand: string;
  modelName: string;
  owner: string;
}

interface PretripRequest {
  id: string;
  vehicle: Vehicle;
  planName: string;
  description: string;
  status: PretripStatus;
  startedAt: string;
  endedAt?: string;
}

const getPretripStatusIcon = (status: PretripStatus) => {
  switch (status) {
    case "completed": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "vehicle_returned": return <RotateCcw className="h-4 w-4 text-green-500" />;
    case "report_created": return <FileText className="h-4 w-4 text-blue-500" />;
    case "analysing": return <Wrench className="h-4 w-4 text-orange-500" />;
    case "booked": return <ClipboardCheck className="h-4 w-4 text-gray-500" />;
    case "cancelled": return <X className="h-4 w-4 text-red-500" />;
    default: return <AlertCircle className="h-4 w-4 text-red-500" />;
  }
};

const getPretripStatusColor = (status: PretripStatus) => {
  switch (status) {
    case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "vehicle_returned": return "bg-green-50 text-green-700 border-green-200";
    case "report_created": return "bg-blue-50 text-blue-700 border-blue-200";
    case "analysing": return "bg-orange-50 text-orange-700 border-orange-200";
    case "booked": return "bg-gray-50 text-gray-700 border-gray-200";
    case "cancelled": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const formatStatus = (status: PretripStatus) => {
  return status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
  };
};

export default function PretripCheckup() {
  const [page, setPage] = useState(1);
  const { data, isFetching } = usePretripServiceHistoryQuery({ page });
  const history = data?.history ?? [];
  const hasMore = data?.hasMore ?? false;
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaderRef.current || !hasMore || isFetching) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setPage(prev => prev + 1);
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  const handleViewDetails = (requestId: string) => {
    navigate(`/user/pretrip-checkup/${requestId}/details`);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {history.map((request: PretripRequest) => {
        const startTime = formatDateTime(request.startedAt);
        const endTime = request.endedAt ? formatDateTime(request.endedAt) : null;
        return (
          <Card key={request.id} onClick={() => handleViewDetails(request.id)} className="border border-gray-200 hover:shadow-md transition-all duration-200 bg-white rounded-lg">
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="flex-shrink-0 mt-0.5">{getPretripStatusIcon(request.status)}</div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">{request.planName}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{request.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-xs sm:text-sm">
                    <Car className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 min-w-0">
                      <span className="text-gray-900 font-medium">{request.vehicle?.brand} {request.vehicle?.modelName}</span>
                      <span className="text-gray-400 hidden xs:inline">•</span>
                      <span className="text-gray-600">{request.vehicle?.regNo}</span>
                      <span className="text-gray-400 hidden sm:inline">•</span>
                      <span className="text-gray-600 truncate hidden sm:inline">{request.vehicle?.owner}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 lg:gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">Started:</span>
                      <span className="text-xs">{startTime.date} at {startTime.time}</span>
                    </div>
                    {endTime && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-700">Ended:</span>
                        <span className="text-xs">{endTime.date} at {endTime.time}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-3 flex-shrink-0">
                  <Badge variant="outline" className={`text-xs font-medium px-2 py-1 rounded-md ${getPretripStatusColor(request.status)}`}>
                    {formatStatus(request.status)}
                  </Badge>
                  <Button variant="ghost" size="sm"  className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 rounded-md flex-shrink-0">
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <div ref={loaderRef} />
      {isFetching && (
        <div className="flex items-center justify-center py-6 sm:py-8">
          <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-xs sm:text-sm text-gray-600">Loading more requests...</span>
        </div>
      )}
      {!hasMore && history.length > 0 && (
        <div className="text-center py-6 sm:py-8">
          <p className="text-xs sm:text-sm text-gray-500">No more requests to load</p>
        </div>
      )}
    </div>
  );
}