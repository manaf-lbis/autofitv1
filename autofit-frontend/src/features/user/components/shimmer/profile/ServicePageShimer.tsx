// src/components/shimmer/ServicesPageShimmer.tsx
import { Wrench, Car, Truck } from "lucide-react";

const tabs = [
  { id: "roadside", label: "Roadside", icon: Wrench, fullLabel: "Roadside Assistance" },
  { id: "pretrip", label: "Pre-trip", icon: Car, fullLabel: "Pre-trip Check" },
  { id: "live", label: "Live", icon: Truck, fullLabel: "Live Assistance" },
];

export default function ServicesPageShimmer() {
  // Shimmer animation style
  const shimmer = `relative overflow-hidden rounded-lg bg-gray-200/50 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Placeholder */}
        <div className="mb-4 sm:mb-6">
          <div className={`${shimmer} h-6 sm:h-8 w-40 sm:w-48 mb-2 rounded`}></div>
          <div className={`${shimmer} h-4 sm:h-5 w-64 sm:w-72 rounded`}></div>
        </div>

        {/* Tab Navigation Placeholder */}
        <div className="mb-4 sm:mb-6">
          <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-2xl p-2 shadow-lg">
            <div className="flex relative">
              {/* Active Tab Indicator Placeholder (default to "roadside") */}
              <div
                className="absolute top-0 bottom-0 bg-white rounded-xl shadow-md transition-all duration-300 ease-out"
                style={{
                  left: `${tabs.findIndex((tab) => tab.id === "roadside") * (100 / tabs.length)}%`,
                  width: `${100 / tabs.length}%`,
                }}
              />
              {/* Tab Buttons Placeholder */}
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className="relative flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-4 rounded-xl"
                >
                  <div className={`${shimmer} h-5 w-5 rounded-full`}></div>
                  <div className={`${shimmer} h-4 sm:h-5 w-20 sm:w-28 rounded`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Container Placeholder (Roadside Tab Only) */}
        <div className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6">
            <div>
              {/* Header and Badge Placeholder */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div className={`${shimmer} h-6 sm:h-7 w-48 sm:w-56 rounded`}></div>
                <div className={`${shimmer} h-6 w-20 sm:w-24 rounded`}></div>
              </div>

              {/* Scrollable Services Placeholder */}
              <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto space-y-3 sm:space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-sm bg-white/50 border border-white/30 rounded-xl p-4 sm:p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1">
                        {/* Status and Issue Placeholder */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`${shimmer} h-5 w-5 rounded-full`}></div>
                            <div className={`${shimmer} h-6 w-24 rounded`}></div>
                          </div>
                          <div className={`${shimmer} h-5 sm:h-6 w-32 sm:w-40 rounded`}></div>
                        </div>

                        {/* Service Timeline Placeholder */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className={`${shimmer} h-4 w-4 rounded-full`}></div>
                              <div className={`${shimmer} h-4 w-28 rounded`}></div>
                            </div>
                            <div className="flex items-center gap-2 ml-4 sm:ml-6">
                              <div className={`${shimmer} h-4 w-4 rounded-full`}></div>
                              <div className={`${shimmer} h-4 w-36 rounded`}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className={`${shimmer} h-4 w-4 rounded-full`}></div>
                              <div className={`${shimmer} h-4 w-28 rounded`}></div>
                            </div>
                            <div className="flex items-center gap-2 ml-4 sm:ml-6">
                              <div className={`${shimmer} h-4 w-4 rounded-full`}></div>
                              <div className={`${shimmer} h-4 w-36 rounded`}></div>
                            </div>
                          </div>
                        </div>

                        {/* Vehicle ID Placeholder */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className={`${shimmer} h-4 w-4 rounded-full`}></div>
                          <div className={`${shimmer} h-4 w-24 rounded`}></div>
                        </div>

                        {/* Issue Description Placeholder */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                          <div className={`${shimmer} h-4 w-full rounded mb-2`}></div>
                          <div className={`${shimmer} h-4 w-3/4 rounded`}></div>
                        </div>

                        {/* Quotation Sent Message Placeholder (optional) */}
                        <div className="mt-3 bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200">
                          <div className={`${shimmer} h-4 w-48 rounded`}></div>
                        </div>
                      </div>

                      {/* View Details Button Placeholder */}
                      <div className="flex lg:block">
                        <div className={`${shimmer} h-8 w-full lg:w-32 rounded-lg`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}