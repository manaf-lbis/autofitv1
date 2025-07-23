import { Card, CardContent, CardHeader } from "@/components/ui/card"

const ShimmerCard: React.FC = () => (
  <Card className="relative w-80 h-[55vh] bg-white shadow-xl border border-gray-200 rounded-lg flex flex-col">
    <CardHeader className="text-center pt-8 pb-4 px-6">
      <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-4" />
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="text-left space-y-1">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto" />
      </div>
    </CardHeader>
    <CardContent className="px-6 pb-6 flex flex-col flex-grow">
      <div className="bg-gray-50 rounded-lg p-4 mb-4 flex-grow">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start mb-3">
            <div className="h-5 w-5 bg-gray-200 rounded-full mr-3 animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
    </CardContent>
  </Card>
)

export const PlanPageShimmer: React.FC = () => (
  <div className="min-h-screen mt-14 bg-gray-50 overflow-hidden">
    <div className="text-center pt-6 pb-4 px-4">
      <div className="inline-flex items-center gap-2 bg-gray-200 h-8 w-40 rounded-full mx-auto mb-4 animate-pulse" />
      <div className="h-8 w-3/4 max-w-2xl bg-gray-200 rounded animate-pulse mx-auto mb-3" />
      <div className="h-4 w-1/2 max-w-xl bg-gray-200 rounded animate-pulse mx-auto mb-4" />
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
    </div>
    <div className="relative px-4 pb-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[65vh] py-4 flex items-center justify-center">
          <div className="absolute w-80 left-1/2 transform -translate-x-1/2 scale-110 z-50">
            <ShimmerCard />
          </div>
          <div className="hidden md:block absolute w-80 left-[35%] transform -translate-x-1/2 scale-95 opacity-95 z-45">
            <ShimmerCard />
          </div>
          <div className="hidden lg:block absolute w-80 left-[20%] transform -translate-x-1/2 scale-90 opacity-90 z-40">
            <ShimmerCard />
          </div>
          <div className="hidden md:block absolute w-80 left-[65%] transform -translate-x-1/2 scale-95 opacity-95 z-45">
            <ShimmerCard />
          </div>
          <div className="hidden lg:block absolute w-80 left-[80%] transform -translate-x-1/2 scale-90 opacity-90 z-40">
            <ShimmerCard />
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-2 w-2 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-full sm:w-40 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  </div>
)