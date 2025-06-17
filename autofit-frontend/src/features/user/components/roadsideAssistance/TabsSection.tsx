import { cn } from "@/lib/utils";

interface TabsSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showTrackTab: boolean;
}

export function TabsSection({ activeTab, onTabChange, showTrackTab }: TabsSectionProps) {
  return (
    <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 mb-4 gap-2">
      <button
        className={cn(
          "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
          activeTab === "details"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded-t-lg"
        )}
        onClick={() => onTabChange("details")}
      >
        Details
      </button>
      {showTrackTab && (
        <button
          className={cn(
            "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
            activeTab === "map"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded-t-lg"
          )}
          onClick={() => onTabChange("map")}
        >
          Track
        </button>
      )}
      <button
        className={cn(
          "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
          activeTab === "payment"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded-t-lg"
        )}
        onClick={() => onTabChange("payment")}
      >
        Payment
      </button>
    </div>
  );
}