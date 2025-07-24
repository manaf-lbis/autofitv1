export default function ScheduleManagementShimer() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
      {/* Calendar Shimmer */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center gap-1">
                <div className="h-7 w-7 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-7 w-7 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 42 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square p-1 rounded-lg bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slots Section Shimmer */}
      <div className="xl:col-span-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="flex items-center gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-gray-200 rounded-full animate-pulse" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
                <div className="h-7 w-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border-2 border-gray-200 bg-gray-50 animate-pulse"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                      <div>
                        <div className="h-5 w-20 bg-gray-200 rounded mb-1" />
                        <div className="h-3 w-12 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </div>
                  <div className="h-7 w-full bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}