import { FileText, Clock, Calendar, Info, Car, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimelineStep {
  id: number;
  title: string;
  time: string | null;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DetailsTabContentProps {
  status: string;
  startedAt: string | null;
  createdAt: string;
  bookingId: string;
  vehicle: { brand: string; modelName: string; regNo: string };
  issue: string;
  timeline: TimelineStep[];
  onViewQuotation: () => void;
  formatDateTime: (dateString: string | null) => string;
  getStatusTitle: (status: string) => string;
}

export function DetailsTabContent({
  status,
  startedAt,
  createdAt,
  bookingId,
  vehicle,
  issue,
  timeline,
  onViewQuotation,
  formatDateTime,
  getStatusTitle,
}: DetailsTabContentProps) {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
        <h3 className="text-sm font-medium text-gray-700">Booking Summary</h3>
      </div>
      <div className="p-5">
        {/* Status Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              {status === "completed" ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-blue-900">{getStatusTitle(status)}</h4>
              <p className="text-sm text-blue-700 mt-0.5">
                {status === "on_the_way"
                  ? "Your mechanic is on the way."
                  : status === "analysing"
                  ? "The mechanic is diagnosing your vehicle issue."
                  : status === "completed"
                  ? "Service has been completed successfully."
                  : status === "quotation_sent"
                  ? "Please review the quotation."
                  : "Your booking is being processed."}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-100">
            <div className="flex items-center gap-1 text-sm text-blue-700">
              <Clock className="w-4 h-4" />
              <span>Started: {formatDateTime(startedAt)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-blue-700">
              <Calendar className="w-4 h-4" />
              <span>{formatDateTime(createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Booking Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Booking Details</h4>
              <div className="mt-2 space-y-1">
                <p className="text-xs flex justify-between">
                  <span className="text-gray-500">Booking ID:</span>
                  <span className="font-medium text-gray-900">{bookingId}</span>
                </p>
                <p className="text-xs flex justify-between">
                  <span className="text-gray-500">Service Type:</span>
                  <span className="font-medium text-gray-900">Emergency Roadside</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Car className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Vehicle Details</h4>
              <div className="mt-2 space-y-1">
                <p className="text-xs flex justify-between">
                  <span className="text-gray-500">Make & Model:</span>
                  <span className="font-medium text-gray-900">
                    {vehicle.brand} {vehicle.modelName}
                  </span>
                </p>
                <p className="text-xs flex justify-between">
                  <span className="text-gray-500">Registration:</span>
                  <span className="font-medium text-gray-900">{vehicle.regNo}</span>
                </p>
                <p className="text-xs flex justify-between">
                  <span className="text-gray-500">Issue:</span>
                  <span className="font-medium text-gray-900">{issue}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Service Timeline</h4>
          <div className="space-y-3">
            {timeline.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center p-3 rounded-lg border",
                  step.status === "completed" && "bg-green-50/50 border-green-100",
                  step.status === "active" && "bg-blue-50/50 border-blue-100",
                  step.status === "pending" && "bg-gray-50/50 border-gray-100"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                    step.status === "completed" && "bg-green-100",
                    step.status === "active" && "bg-blue-100",
                    step.status === "pending" && "bg-gray-100"
                  )}
                >
                  <step.icon
                    className={cn(
                      "w-4 h-4",
                      step.status === "completed" && "text-green-600",
                      step.status === "active" && "text-blue-600",
                      step.status === "pending" && "text-gray-400"
                    )}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        step.status === "completed" && "text-green-900",
                        step.status === "active" && "text-blue-900",
                        step.status === "pending" && "text-gray-500"
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{formatDateTime(step.time)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {status === "quotation_sent" && (
          <Button
            onClick={onViewQuotation}
            className="w-full text-sm h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Service Quotation
          </Button>
        )}
      </div>
    </div>
  );
}