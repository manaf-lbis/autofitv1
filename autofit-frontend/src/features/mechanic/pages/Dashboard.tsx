import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmergencyTab from "../components/dashboard/EmergencyTab";
import PickupTab from "../components/dashboard/PickupTab";
import OnProgressTab from "../components/dashboard/OnProgressTab";
import CompletedTab from "../components/dashboard/CompletedTab";
import { AlertTriangle, CheckCircle, Wrench, Calendar } from "lucide-react";
import { useGetDashboardQuery } from "../api/mechanicApi";
import RecentActivity from "../components/dashboard/RecentActivity";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setEmergencyRequest } from "../slices/mechanicSlice";
import DashboardShimmer from "../components/shimmer/DashboardShimmer";


export default function MechanicDashboard() {
  const [activeTab, setActiveTab] = useState("emergency");
  const dispatch = useDispatch();

  const { data: dashboardData,isLoading } = useGetDashboardQuery(undefined,{refetchOnMountOrArgChange:true});
  const emergencyRequest = useSelector((state: RootState) => state.mechanicSlice.emergencyRequest);

  useEffect(() => {
    if (dashboardData?.data?.emergencyRequest) {
      dispatch(setEmergencyRequest(dashboardData.data.emergencyRequest));
    }
  }, [dashboardData, dispatch]);

  const getTabBadgeCount = (tabId: string) => {
    switch (tabId) {
      case "emergency":
        return emergencyRequest ? 1 : 0;
      case "pickup":
        return 2;
      case "progress":
        return 2;
      case "completed":
        return 2;
      default:
        return 0;
    }
  };

  const tabs = [
    { id: "emergency", label: "Emergency", icon: AlertTriangle },
    { id: "pickup", label: "Pickup", icon: Calendar },
    { id: "progress", label: "Progress", icon: Wrench },
    { id: "completed", label: "Completed", icon: CheckCircle },
  ];

  if(isLoading){
    return <DashboardShimmer />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row lg:h-screen">
        {/* Main Content */}
        <div className="flex-1 lg:order-2">
          <div className="bg-white lg:h-full flex flex-col">
            {/* Tab Navigation */}
            <div className="p-4 lg:p-6 border-b border-gray-100 flex-shrink-0">
              <div className="grid grid-cols-4 gap-2 bg-gray-50 p-1 lg:p-1 rounded-md lg:rounded-lg lg:flex lg:space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const badgeCount = getTabBadgeCount(tab.id);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-2 py-3 lg:flex-1 lg:px-4 lg:py-3 rounded-md text-xs lg:text-sm font-medium transition-colors flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-2 ${
                        activeTab === tab.id
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="lg:inline">{tab.label}</span>
                      {badgeCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {badgeCount}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 lg:overflow-hidden">
              <ScrollArea className="h-full lg:h-[calc(100vh-140px)]">
                <div className="p-4 lg:p-6">
                  {activeTab === "emergency" && (
                    <EmergencyTab emergencyRequest={emergencyRequest ?? null} />
                  )}
                  {activeTab === "pickup" && <PickupTab />}
                  {activeTab === "progress" && <OnProgressTab />}
                  {activeTab === "completed" && <CompletedTab />}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <RecentActivity recentActivities={dashboardData?.data?.recentActivities} />
      </div>
    </div>
  );
}
