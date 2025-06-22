export default function MessagesShimmer() {
  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50 flex">
      {/* Left Sidebar Shimmer */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header Shimmer */}
        <div className="p-6 border-b border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
        </div>

        {/* Chat List Shimmer */}
        <div className="flex-1 overflow-y-auto p-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-4 mb-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-100 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="h-3 bg-gray-200 rounded w-8 animate-pulse"></div>
                  {index % 3 === 0 && <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>}
                </div>
              </div>
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area Shimmer */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header Shimmer */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages Shimmer */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className={`flex ${index % 3 === 0 ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-md px-4 py-3 rounded-lg ${
                    index % 3 === 0 ? "bg-gray-100" : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                    {index % 4 === 0 && <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>}
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input Shimmer */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
