import { cn } from "@/lib/utils"

interface ShimmerProps {
  className?: string
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded",
        className,
      )}
      style={{
        animation: "shimmer 1.5s ease-in-out infinite",
      }}
    />
  )
}

// Calendar Shimmer
export function CalendarSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <Shimmer className="h-5 w-16" />
          <div className="flex items-center gap-1">
            <Shimmer className="h-8 w-8 rounded" />
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Shimmer key={i} className="h-6 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <Shimmer key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Slot Card Shimmer
export function SlotCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border-2 border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Shimmer className="w-12 h-12 rounded-xl" />
          <div>
            <Shimmer className="h-6 w-20 mb-1" />
            <Shimmer className="h-4 w-24" />
          </div>
        </div>
        <Shimmer className="h-6 w-16 rounded-full" />
      </div>
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Shimmer className="w-8 h-8 rounded-lg" />
          <div className="flex-1">
            <Shimmer className="h-4 w-32 mb-1" />
            <Shimmer className="h-3 w-24 mb-2" />
            <Shimmer className="h-3 w-28" />
          </div>
        </div>
      </div>
      <Shimmer className="h-8 w-full rounded" />
    </div>
  )
}

// Service Card Shimmer
export function ServiceCardSkeleton() {
  return (
    <div className="p-4 border border-gray-200 rounded-xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <Shimmer className="w-12 h-12 rounded-xl" />
          <div className="flex-1">
            <Shimmer className="h-4 w-32 mb-1" />
            <Shimmer className="h-3 w-24" />
          </div>
        </div>
        <Shimmer className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
      </div>
      <div className="flex items-center justify-between">
        <Shimmer className="h-5 w-16 rounded-full" />
        <Shimmer className="h-6 w-12" />
      </div>
    </div>
  )
}

// Schedule Management Shimmer
export function ScheduleManagementSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <Shimmer className="h-6 w-48 mb-2" />
            <div className="flex items-center gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Shimmer className="w-3 h-3 rounded-full" />
                  <Shimmer className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Shimmer key={i} className="h-8 w-16 rounded" />
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SlotCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Service History Shimmer
export function ServiceHistorySkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <Shimmer className="h-6 w-32 mb-1" />
            <Shimmer className="h-4 w-48" />
          </div>
          <div className="flex gap-3">
            <Shimmer className="h-10 w-64 rounded" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Shimmer key={i} className="h-8 w-16 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-96 overflow-hidden">
        <div className="p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Add shimmer animation to globals.css
