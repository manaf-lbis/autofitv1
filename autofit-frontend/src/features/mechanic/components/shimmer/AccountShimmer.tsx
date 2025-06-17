export default function AccountShimmer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative max-w-7xl">
        {/* Hero Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden mb-8">
          <div className="relative bg-slate-800 p-8">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-gray-200 animate-shimmer"></div>
                <div className="space-y-3">
                  <div className="w-40 h-8 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-32 h-6 bg-gray-200 rounded animate-shimmer"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-shimmer"></div>
                </div>
                <div className="w-16 h-3 bg-gray-200 rounded animate-shimmer"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Quick Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-6">
              <div className="w-32 h-6 bg-gray-200 rounded animate-shimmer mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="text-center p-4 bg-blue-50/80 rounded-xl animate-shimmer-delay">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg mx-auto mb-2 animate-shimmer"></div>
                    <div className="w-12 h-6 bg-gray-200 rounded mx-auto mb-1 animate-shimmer"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded mx-auto animate-shimmer"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-6">
              <div className="w-32 h-6 bg-gray-200 rounded animate-shimmer mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3 animate-shimmer-delay">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg animate-shimmer"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-24 h-4 bg-gray-200 rounded animate-shimmer"></div>
                      <div className="w-32 h-4 bg-gray-200 rounded animate-shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-6">
              <div className="w-32 h-6 bg-gray-200 rounded animate-shimmer mb-4"></div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border border-gray-200/50 animate-shimmer-delay">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg animate-shimmer"></div>
                    <div className="space-y-2">
                      <div className="w-28 h-4 bg-gray-200 rounded animate-shimmer"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-shimmer"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Shop Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shop Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/30">
                <div className="flex items-center justify-between">
                  <div className="w-40 h-6 bg-gray-200 rounded animate-shimmer"></div>
                  <div className="w-24 h-8 bg-gray-200 rounded animate-shimmer"></div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="w-48 h-8 bg-gray-200 rounded animate-shimmer"></div>
                    <div className="w-64 h-4 bg-gray-200 rounded animate-shimmer"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-blue-50/80 rounded-xl p-4 animate-shimmer-delay">
                        <div className="w-24 h-4 bg-gray-200 rounded mb-2 animate-shimmer"></div>
                        <div className="w-32 h-4 bg-gray-200 rounded animate-shimmer"></div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <div className="w-full h-64 bg-gray-200 rounded-lg animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-6">
              <div className="w-32 h-6 bg-gray-200 rounded animate-shimmer mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-0 bg-gray-50 rounded-xl animate-shimmer-delay">
                    <div className="w-3 h-3 bg-gray-200 rounded-full animate-shimmer"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-40 h-4 bg-gray-200 rounded animate-shimmer"></div>
                      <div className="w-24 h-3 bg-gray-200 rounded animate-shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          animation: shimmer 2s infinite;
        }

        .animate-shimmer-delay {
          animation: shimmer-delay 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}