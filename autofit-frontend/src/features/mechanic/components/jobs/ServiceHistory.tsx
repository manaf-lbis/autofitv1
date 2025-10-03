import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Clock, Activity, CheckCircle2, Phone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { usePretripHistroyQuery } from "@/services/mechanicServices/pretripMechanicApi"
import { useLiveAssistanceHistoryQuery } from "@/services/mechanicServices/mechanicLiveAssistanceApi"

interface ServiceHistoryProps {
  loading?: boolean
  mode: 'pretrip' | 'live'
}

function getStatus(status: string, mode: 'pretrip' | 'live'): 'active' | 'completed' {
  const activeStatuses = mode === 'pretrip' 
    ? ['booked', 'analysing']
    : ['pending', 'ongoing'];
  return activeStatuses.includes(status.toLowerCase()) ? 'active' : 'completed';
}

export function ServiceHistory({ loading = false, mode }: ServiceHistoryProps) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const observerRef = useRef<HTMLDivElement>(null)

  const query = mode === 'pretrip' ? usePretripHistroyQuery : useLiveAssistanceHistoryQuery
  const { data, isLoading, isFetching } = query({ page })

  const services = data?.history || []
  const hasMore = data?.hasMore || false

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isFetching) {
        setPage(prev => prev + 1)
      }
    })
    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore, isFetching])

  const filteredServices = services.filter((service: any) => {
    const customer = mode === 'pretrip' ? service.vehicle.owner : service.user.name
    const vehicle = mode === 'pretrip' ? service.vehicle.regNo : ''
    const planOrIssue = mode === 'pretrip' ? service.planName.toLowerCase() : service.issue.toLowerCase()
    const matchesSearch = 
      customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planOrIssue.includes(searchTerm.toLowerCase())
    const serviceStatus = getStatus(service.status, mode)
    const matchesStatus = statusFilter === "all" || serviceStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleServiceClick = (serviceId: string): void => {
    if (mode === 'pretrip') {
      navigate(`/mechanic/pre-trip-checkup/${serviceId}/details`)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="h-80 overflow-hidden">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-5 w-14 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{mode === 'pretrip' ? 'Service' : 'Call'} History</h3>
            <p className="text-sm text-gray-600">Active work and completed services ({filteredServices.length})</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-48 text-sm h-9"
              />
            </div>
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="text-xs"
            >
              All
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("active")}
              className="text-xs"
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
              className="text-xs"
            >
              Completed
            </Button>
          </div>
        </div>
      </div>

      <div className="h-80 overflow-y-auto">
        <div className="p-4">
          {filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-base font-medium text-gray-900 mb-1">No Services Found</h4>
              <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service: any) => {
                const serviceStatus = getStatus(service.status, mode)
                const Icon = mode === 'live' ? Phone : (serviceStatus === "active" ? Activity : CheckCircle2)
                const startTime = service.startedAt || service.schedule?.start
                const endTime = service.endedAt || service.schedule?.end
                const endDisplay = endTime ? new Date(endTime).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }) : (serviceStatus === 'active' ? 'Ongoing' : 'N/A')
                return (
                  <div
                    key={service._id}
                    className={cn(
                      "p-4 border border-gray-200 rounded-xl hover:shadow-lg cursor-pointer hover:border-blue-300 group transition-all bg-white",
                      mode === 'live' && "cursor-default"
                    )}
                    onClick={mode === 'pretrip' ? () => handleServiceClick(service._id) : undefined}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                          <Icon className="w-6 h-6 text-orange-600 group-hover:text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 group-hover:text-blue-900 text-sm truncate">
                            {mode === 'pretrip' ? service.vehicle.owner : service.user.name}
                          </p>
                          <p className="text-xs font-mono text-gray-600 truncate">
                            {mode === 'pretrip' ? service.vehicle.regNo : 'Video Assistance'}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "text-xs font-medium shadow-sm flex-shrink-0",
                          serviceStatus === "active" && "bg-orange-100 text-orange-800 hover:bg-orange-100",
                          serviceStatus === "completed" && "bg-green-100 text-green-800 hover:bg-green-100",
                        )}
                      >
                        {serviceStatus === "active" ? "In Progress" : "Completed"}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          Start: {new Date(startTime).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          End: {endDisplay}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        {mode === 'pretrip' ? service.planName : service.issue}
                      </Badge>
                      {mode === 'live' && service.price && (
                        <p className="text-sm font-bold text-gray-900">₹{service.price}</p>
                      )}
                    </div>

                    {mode === 'pretrip' && (
                      <div className="flex items-center justify-end pt-2 border-t border-gray-100">
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex justify-center py-4">
          <div ref={observerRef} className="h-1 w-1" />
          {isFetching && <p className="text-gray-600">Loading more...</p>}
        </div>
      </div>
    </div>
  )
}