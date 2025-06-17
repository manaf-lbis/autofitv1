export default function BookingDetailsShimmer() {
  return (
    <div className="min-h-screen">
      <div className="px-4 py-6 sm:px-6 max-w-6xl mx-auto">
        {/* Back Button with Text */}
        <div className="mb-6 flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-shimmer"></div>
          <div className="w-12 h-4 bg-gray-200 rounded animate-shimmer"></div>
        </div>

        {/* Status Badge and Refetch Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="w-24 h-8 bg-gray-200 rounded animate-shimmer"></div>
          <div className="w-24 h-6 bg-gray-200 rounded animate-shimmer"></div>
        </div>

        {/* Customer & Vehicle Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Customer Card */}
          <div className="shadow-sm border-0 bg-white rounded-lg animate-shimmer-delay">
            <div className="p-4">
              <div className="flex items-center text-gray-900 text-sm font-medium mb-3">
                <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-shimmer"></div>
                <div className="w-32 h-4 bg-gray-200 rounded animate-shimmer"></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-shimmer"></div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-shimmer"></div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-shimmer"></div>
                </div>
              </div>
              <div className="w-full h-9 bg-gray-200 rounded mt-4 animate-shimmer"></div>
            </div>
          </div>

          {/* Vehicle Card */}
          <div className="shadow-sm border-0 bg-white rounded-lg animate-shimmer-delay">
            <div className="p-4">
              <div className="flex items-center text-gray-900 text-sm font-medium mb-3">
                <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-shimmer"></div>
                <div className="w-32 h-4 bg-gray-200 rounded animate-shimmer"></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-shimmer"></div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-shimmer"></div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-shimmer"></div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Issue Details */}
        <div className="shadow-sm border-0 bg-white rounded-lg mb-6 animate-shimmer-delay">
          <div className="p-4">
            <div className="flex items-center justify-between text-gray-900 text-base mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3 animate-shimmer"></div>
                <div className="w-32 h-6 bg-gray-200 rounded animate-shimmer"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="w-48 h-6 bg-gray-200 rounded mb-2 animate-shimmer"></div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded animate-shimmer"></div>
                    <div className="w-5/6 h-4 bg-gray-200 rounded animate-shimmer"></div>
                    <div className="w-4/5 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 bg-gray-200 rounded shrink-0 animate-shimmer"></div>
                  <div>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1 animate-shimmer"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="shadow-sm border-0 bg-white rounded-lg mb-6 animate-shimmer-delay">
          <div className="p-4">
            <div className="flex items-center text-gray-900 text-base mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3 animate-shimmer"></div>
              <div className="w-32 h-6 bg-gray-200 rounded animate-shimmer"></div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded shrink-0 animate-shimmer"></div>
                <div>
                  <div className="w-40 h-4 bg-gray-200 rounded mb-1 animate-shimmer"></div>
                  <div className="w-64 h-4 bg-gray-200 rounded animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="w-full h-10 bg-gray-200 rounded-lg animate-shimmer"></div>
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
          animation: shimmer 2s infinite;
        }

        .animate-shimmer-delay {
          animation: shimmer-delay 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}