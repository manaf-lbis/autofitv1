export default function DashboardShimmer() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Shimmer */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 p-6">
          {/* Recent Activity Header */}
          <div className="flex items-center mb-6">
            <div className="w-5 h-5 bg-gray-200 rounded animate-shimmer mr-3"></div>
            <div className="w-32 h-5 bg-gray-200 rounded animate-shimmer"></div>
          </div>

          {/* Activity Items */}
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-shimmer-delay">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-shimmer"></div>
                  <div className="flex-1">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-shimmer mb-2"></div>
                    <div className="w-36 h-3 bg-gray-200 rounded animate-shimmer mb-1"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded animate-shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Top Navigation Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((tab) => (
              <div key={tab} className="bg-white rounded-lg p-4 border border-gray-200 animate-shimmer-delay">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-shimmer"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  </div>
                  <div className="w-6 h-6 bg-red-200 rounded-full animate-shimmer"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Booking Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm animate-shimmer-delay">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded animate-shimmer"></div>
                <div className="w-32 h-6 bg-gray-200 rounded animate-shimmer"></div>
              </div>
              <div className="w-16 h-6 bg-red-200 rounded animate-shimmer"></div>
            </div>

            {/* Issue Type */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-5 h-5 bg-red-200 rounded animate-shimmer"></div>
              <div className="w-28 h-5 bg-gray-200 rounded animate-shimmer"></div>
            </div>

            {/* Description */}
            <div className="space-y-2 mb-6">
              <div className="w-full h-4 bg-gray-200 rounded animate-shimmer"></div>
              <div className="w-5/6 h-4 bg-gray-200 rounded animate-shimmer"></div>
              <div className="w-4/5 h-4 bg-gray-200 rounded animate-shimmer"></div>
            </div>

            {/* Vehicle Info */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-shimmer"></div>
              <div className="w-24 h-4 bg-gray-200 rounded animate-shimmer"></div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-shimmer"></div>
              <div className="w-64 h-4 bg-gray-200 rounded animate-shimmer"></div>
            </div>

            {/* Time and Status */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-5 h-5 bg-gray-200 rounded animate-shimmer"></div>
              <div className="w-32 h-4 bg-gray-200 rounded animate-shimmer"></div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="w-24 h-10 bg-red-200 rounded-lg animate-shimmer"></div>
              <div className="w-20 h-10 bg-gray-200 rounded-lg animate-shimmer"></div>
            </div>
          </div>

          {/* Additional Cards for Mobile */}
          <div className="lg:hidden mt-6 space-y-4">
            {[1, 2].map((card) => (
              <div key={card} className="bg-white rounded-xl border border-gray-200 p-4 animate-shimmer-delay">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-24 h-5 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-12 h-5 bg-red-200 rounded animate-shimmer"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-3/4 h-3 bg-gray-200 rounded animate-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes shimmer-delay {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: shimmer 2s infinite; /* Medium speed: 2 seconds */
        }

        .animate-shimmer-delay {
          animation: shimmer-delay 2s ease-in-out infinite; /* Match speed: 2 seconds */
        }
      `}</style>
    </div>
  );
}