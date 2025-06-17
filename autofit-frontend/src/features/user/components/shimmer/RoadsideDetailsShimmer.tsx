import { ArrowLeft } from "lucide-react";

export default function RoadsideDetailsShimmer() {
  const shimmer = "animate-pulse bg-gray-200 rounded";

  return (
    <div className="min-h-screen mt-16 relative overflow-hidden">
      <main className="container mx-auto px-4 py-6 relative">
        {/* Back Link */}
        <div className="mb-4 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2 text-gray-200" />
          <div className={`${shimmer} h-4 w-12`} />
        </div>

        {/* Heading Section */}
        <div className="bg-white/90 rounded-xl shadow-lg p-6 mb-5 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className={`${shimmer} h-8 w-48`} />
              <div className={`${shimmer} h-4 w-64`} />
              <div className="flex items-center gap-2 mt-2">
                <div className={`${shimmer} h-6 w-24 rounded-full`} />
                <div className={`${shimmer} h-6 w-32 rounded-full`} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`${shimmer} h-8 w-24 rounded`} />
              <div className={`${shimmer} h-8 w-24 rounded`} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-4 gap-2">
          <div className={`${shimmer} h-10 w-20 rounded-t-lg`} />
          <div className={`${shimmer} h-10 w-20 rounded-t-lg`} />
          <div className={`${shimmer} h-10 w-20 rounded-t-lg`} />
        </div>

        {/* Tab Content and Left Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Right Column (Tab Content) - First on Mobile */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white/90 rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-3 border-b border-gray-100">
                <div className={`${shimmer} h-4 w-32`} />
              </div>
              <div className="p-5">
                {/* Status Card */}
                <div className="rounded-xl p-4 border border-gray-100 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`${shimmer} w-10 h-10 rounded-full`} />
                    <div className="space-y-2">
                      <div className={`${shimmer} h-5 w-40`} />
                      <div className={`${shimmer} h-4 w-64`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className={`${shimmer} h-4 w-32`} />
                    <div className={`${shimmer} h-4 w-32`} />
                  </div>
                </div>

                {/* Booking Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className={`${shimmer} w-8 h-8 rounded-full`} />
                    <div className="space-y-2 w-full">
                      <div className={`${shimmer} h-4 w-24`} />
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <div className={`${shimmer} h-3 w-20`} />
                          <div className={`${shimmer} h-3 w-24`} />
                        </div>
                        <div className="flex justify-between">
                          <div className={`${shimmer} h-3 w-20`} />
                          <div className={`${shimmer} h-3 w-24`} />
                        </div>
                        <div className="flex justify-between">
                          <div className={`${shimmer} h-3 w-20`} />
                          <div className={`${shimmer} h-3 w-24`} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className={`${shimmer} w-8 h-8 rounded-full`} />
                    <div className="space-y-2 w-full">
                      <div className={`${shimmer} h-4 w-24`} />
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <div className={`${shimmer} h-3 w-20`} />
                          <div className={`${shimmer} h-3 w-24`} />
                        </div>
                        <div className="flex justify-between">
                          <div className={`${shimmer} h-3 w-20`} />
                          <div className={`${shimmer} h-3 w-24`} />
                        </div>
                        <div className="flex justify-between">
                          <div className={`${shimmer} h-3 w-20`} />
                          <div className={`${shimmer} h-3 w-24`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-6">
                  <div className={`${shimmer} h-4 w-32 mb-3`} />
                  <div className="space-y-3">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 rounded-lg border border-gray-100"
                        >
                          <div className={`${shimmer} w-8 h-8 rounded-full mr-3`} />
                          <div className="flex-1 flex items-center justify-between">
                            <div className={`${shimmer} h-4 w-32`} />
                            <div className={`${shimmer} h-3 w-24`} />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className={`${shimmer} h-10 w-full rounded`} />
              </div>
            </div>
          </div>

          {/* Left Column - Below on Mobile */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            {/* Mechanic Card */}
            <div className="bg-white/90 rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4">
              <div className="p-3 border-b border-gray-100">
                <div className={`${shimmer} h-4 w-32`} />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`${shimmer} w-14 h-14 rounded-full border-2 border-gray-100`} />
                  <div className="space-y-2">
                    <div className={`${shimmer} h-4 w-24`} />
                    <div className={`${shimmer} h-3 w-12`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-white/90 rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4">
              <div className="p-3 border-b border-gray-100">
                <div className={`${shimmer} h-4 w-32`} />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <div className={`${shimmer} h-3 w-20`} />
                  <div className={`${shimmer} h-3 w-24`} />
                </div>
                <div className="flex justify-between">
                  <div className={`${shimmer} h-3 w-20`} />
                  <div className={`${shimmer} h-3 w-24`} />
                </div>
                <div className="flex justify-between">
                  <div className={`${shimmer} h-3 w-20`} />
                  <div className={`${shimmer} h-3 w-24`} />
                </div>
              </div>
            </div>

            {/* Issue Details Card */}
            <div className="bg-white/90 rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <div className={`${shimmer} h-4 w-32`} />
              </div>
              <div className="p-4 space-y-2">
                <div className="space-y-1">
                  <div className={`${shimmer} h-3 w-20`} />
                  <div className={`${shimmer} h-3 w-48`} />
                </div>
                <div className="flex justify-between">
                  <div className={`${shimmer} h-3 w-20`} />
                  <div className={`${shimmer} h-3 w-24`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}