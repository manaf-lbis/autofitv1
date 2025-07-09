import { useState } from "react";
import {
  ChevronRight,
  Wrench,
  CheckCircle2,
  Clock,
  AlertCircle,
  Car,
  Calendar,
  Hash,
  Truck,
  Play,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useServiceHistoryQuery } from "../../../../services/userServices/profileApi";
import { useNavigate } from "react-router-dom";
import ServicesPageShimmer from "../../components/shimmer/profile/ServicePageShimer";

interface ServiceRecord {
  _id: string;
  status: "assigned" | "on_the_way" | "analysing" | "quotation_sent" | "in_progress" | "completed" | "canceled";
  issue: string;
  description: string;
  startedAt: string | null;
  endedAt: string | null;
  vehicle: {
    regNo: string;
    brand: string;
    modelName: string;
    owner: string;
  };
}

const tabs = [
  { id: "roadside", label: "Roadside", icon: Wrench, fullLabel: "Roadside Assistance" },
  { id: "pretrip", label: "Pre-trip", icon: Car, fullLabel: "Pre-trip Check" },
  { id: "live", label: "Live", icon: Truck, fullLabel: "Live Assistance" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case "in_progress":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "on_the_way":
      return <Truck className="h-5 w-5 text-indigo-500" />;
    case "analysing":
      return <Wrench className="h-5 w-5 text-orange-500" />;
    case "quotation_sent":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case "assigned":
      return <Play className="h-5 w-5 text-gray-500" />;
    case "canceled":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-red-500" />;
  }
};

const getStatusColor = (status: string) => {
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
      return "bg-red-50 text-red-700 border-red-200";
  }
};

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("roadside");
  const navigate = useNavigate();

  const { data, isLoading } = useServiceHistoryQuery({});
  const roadsideAssistanceData = data?.data || [];

  const handleViewDetails = (serviceId: string) => {
    navigate(`/user/roadside-assistance/${serviceId}/details`);
  };

  if (isLoading) return <ServicesPageShimmer />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Services</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and track your mechanic services</p>
        </div>

        {/* Modern Tab Navigation */}
        <div className="mb-4 sm:mb-6">
          <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl p-2 shadow-lg">
            <div className="flex relative">
              {/* Active Tab Indicator */}
              <div
                className="absolute top-0 bottom-0 bg-white rounded-xl shadow-md transition-all duration-300 ease-out"
                style={{
                  left: `${tabs.findIndex((tab) => tab.id === activeTab) * (100 / tabs.length)}%`,
                  width: `${100 / tabs.length}%`,
                }}
              />

              {/* Tab Buttons */}
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300 ${
                      isActive ? "text-gray-900 z-10" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm lg:text-base">
                      <span className="sm:hidden">{tab.label}</span>
                      <span className="hidden sm:inline">{tab.fullLabel}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6">
            {activeTab === "roadside" && (
              <div>
                {roadsideAssistanceData.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Wrench className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      No Roadside Assistance Services
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-4">
                      You haven’t booked any roadside assistance services yet.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Roadside Assistance</h2>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 w-fit">
                        {roadsideAssistanceData.length} Services
                      </Badge>
                    </div>

                    {/* Scrollable Services Container */}
                    <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto space-y-3 sm:space-y-4">
                      {roadsideAssistanceData.map((service: ServiceRecord) => (
                        <div
                          key={service._id}
                          className="backdrop-blur-sm bg-white/50 border border-white/30 rounded-xl p-4 sm:p-6"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                            <div className="flex-1">
                              {/* Status and Issue */}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(service.status)}
                                  <Badge className={`${getStatusColor(service.status)} text-xs sm:text-sm`}>
                                    {service.status.charAt(0).toUpperCase() +
                                      service.status.slice(1).replace("_", " ")}
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{service.issue}</h3>
                              </div>

                              {/* Service Timeline */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Play className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                      Service Started
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 ml-4 sm:ml-6">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                    <span className="text-xs sm:text-sm text-gray-600">
                                      {service.startedAt
                                        ? new Date(service.startedAt).toLocaleString()
                                        : "Not yet started"}
                                    </span>
                                  </div>
                                </div>

                                {service.endedAt && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Square className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                                        Service Ended
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4 sm:ml-6">
                                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                      <span className="text-xs sm:text-sm text-gray-600">
                                        {new Date(service.endedAt).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Vehicle ID */}
                              <div className="flex items-center gap-2 mb-4">
                                <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                <span className="text-sm sm:text-base text-gray-600 font-medium">
                                  {service.vehicle.regNo}
                                </span>
                              </div>

                              {/* Issue Description */}
                              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                  {service.description}
                                </p>
                              </div>

                              {/* Quotation Sent Message */}
                              {service.status === "quotation_sent" && (
                                <div className="mt-3 bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200">
                                  <p className="text-sm sm:text-base text-yellow-700 font-medium">
                                    Approve & Pay to Continue Service
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* View Details Button */}
                            <div className="flex lg:block">
                              <Button
                                onClick={() => handleViewDetails(service._id)}
                                variant="outline"
                                size="sm"
                                className="bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm w-full lg:w-auto"
                              >
                                <span className="sm:hidden">Details</span>
                                <span className="hidden sm:inline">View Details</span>
                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "pretrip" && (
              <div className="text-center py-8 sm:py-12">
                <Car className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Pre-trip Check Services</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-4">
                  Comprehensive vehicle inspection before your journey
                </p>
                <div className="backdrop-blur-sm bg-white/50 border border-white/30 rounded-xl p-4 max-w-sm sm:max-w-md mx-auto">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Coming soon - Pre-trip inspection services will be available here
                  </p>
                </div>
              </div>
            )}

            {activeTab === "live" && (
              <div className="text-center py-8 sm:py-12">
                <Truck className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Live Assistance Services</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-4">
                  Real-time support and guidance for your vehicle issues
                </p>
                <div className="backdrop-blur-sm bg-white/50 border border-white/30 rounded-xl p-4 max-w-sm sm:max-w-md mx-auto">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Coming soon - Live assistance features will be available here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}