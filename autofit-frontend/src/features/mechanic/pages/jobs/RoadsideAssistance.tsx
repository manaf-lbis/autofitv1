import * as React from "react"
import { Search, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useRoadsideServiceHistoryQuery } from "@/services/mechanicServices/roadsideApi"
import { useDebounce } from "@/hooks/useDebounce"
import { useNavigate } from "react-router-dom"

type AssistanceStatus = "Completed" | "In Progress" | "Pending" | "canceled" | "on_the_way"

type AssistanceRecord = {
  id: string
  name: string
  vehicleRegNo: string
  status: AssistanceStatus
  date: string
  details?: string
}

function truncate(input: string, max = 15) {
  if (input.length <= max) return input
  return input.slice(0, max) + "…"
}

function StatusBadge({ status }: { status: AssistanceStatus }) {
  const statusConfig = {
    "Completed": {
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm",
      indicator: "bg-emerald-500"
    },
    "In Progress": {
      classes: "bg-blue-50 text-blue-700 border-blue-200 shadow-sm",
      indicator: "bg-blue-500"
    },
    "on_the_way": {
      classes: "bg-amber-50 text-amber-700 border-amber-200 shadow-sm",
      indicator: "bg-amber-500"
    },
    "canceled": {
      classes: "bg-red-50 text-red-700 border-red-200 shadow-sm",
      indicator: "bg-red-500"
    },
    "Pending": {
      classes: "bg-slate-50 text-slate-700 border-slate-200 shadow-sm",
      indicator: "bg-slate-500"
    }
  }

  const config = statusConfig[status] || statusConfig["Pending"]

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-all duration-200",
        config.classes
      )}
    >
      <div className={cn("w-1.5 h-1.5 rounded-full", config.indicator)} />
      {status === "on_the_way" ? "On the Way" : status}
    </Badge>
  )
}

function SkeletonRow() {
  return (
    <TableRow className="group border-none">
      <TableCell className="py-4">
        <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-200" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-24 animate-pulse rounded-lg bg-slate-200" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 animate-pulse rounded-lg bg-slate-200" />
      </TableCell>
      <TableCell className="text-right">
        <div className="ml-auto h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
      </TableCell>
    </TableRow>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3 text-slate-600">
        <div className="relative">
          <div className="w-5 h-5 border-2 border-slate-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span className="text-sm font-medium">Loading more records...</span>
      </div>
    </div>
  )
}

export default function RoadsideAssistance({
  query: propQuery = "",
  onFirstLoadDone,
  onNavigateToDetails,
}: {
  query?: string
  onFirstLoadDone?: () => void
  onNavigateToDetails?: (id: string) => void
}) {
  const [localQuery, setLocalQuery] = React.useState(propQuery || "")
  const debouncedQuery = useDebounce(localQuery, 500)
  const [page, setPage] = React.useState(1)
  const [allItems, setAllItems] = React.useState<AssistanceRecord[]>([])
  const navigate = useNavigate()
  const [hasMore, setHasMore] = React.useState(true)
  
  const { data, isLoading, isFetching, refetch } = useRoadsideServiceHistoryQuery({ 
    page, 
    search: debouncedQuery 
  })


  React.useEffect(() => {
    if (!data?.history) return

    const newItems: AssistanceRecord[] = data.history.map((item) => ({
      id: item._id,
      name: item.userId.name,
      vehicleRegNo: item.vehicle.regNo,
      status: item.status as AssistanceStatus,
      date: item.startedAt
        ? new Date(item.startedAt).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      details: item.description,
    }))

    if (page === 1) {
      setAllItems(newItems)
    } else {
      setAllItems(prev => {
        const existingIds = new Set(prev.map(item => item.id))
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id))
        return [...prev, ...uniqueNewItems]
      })
    }

    setHasMore(data.hasMore ?? false)
  }, [data, page])

  React.useEffect(() => {
    setPage(1)
    setAllItems([])
    setHasMore(true)
    refetch()
  }, [debouncedQuery, refetch])

  React.useEffect(() => {
    if (page > 1) {
      refetch()
    }
  }, [page, refetch])

  const isLoadingInitial = isLoading && page === 1
  const isLoadingMore = isFetching && page > 1

  const notifiedFor = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (!isLoading && data && !notifiedFor.current) {
      notifiedFor.current = debouncedQuery || ""
      onFirstLoadDone?.()
    }
  }, [isLoading, data, onFirstLoadDone, debouncedQuery])

  const loadMoreRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (
          entry.isIntersecting && 
          hasMore && 
          !isLoadingInitial && 
          !isLoadingMore &&
          allItems.length > 0 
        ) {
          console.log('Loading more items, current page:', page)
          setPage(prevPage => prevPage + 1)
        }
      },
      { 
        rootMargin: "100px", 
        threshold: 0.1
      }
    )
    
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, isLoadingInitial, isLoadingMore, allItems.length, page])

  const handleViewDetails = (record: AssistanceRecord) => {
    if (onNavigateToDetails) {
      onNavigateToDetails(record.id)
    } else {
      navigate(`/mechanic/roadside-assistance/${record.id}/details`)
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Fixed Header Section */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 -mx-4 px-4 py-4 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between max-w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Roadside Assistance History
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {data?.totalDocuments ? `${data.totalDocuments} assistance records` : "Manage your assistance history"}
            </p>
          </div>
          
          {/* Search Input */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search by name or vehicle reg no..."
              className="pl-10 h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
            />
            {(isLoading || isFetching) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-slate-100 bg-slate-50/50">
                <TableHead className="font-semibold text-slate-700 py-4 px-6">Customer</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4">Vehicle</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4">Date</TableHead>
                <TableHead className="font-semibold text-slate-700 py-4 text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allItems.map((record, index) => (
                <TableRow 
                  key={record.id} 
                  className={cn(
                    "group border-slate-100 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer",
                    index === allItems.length - 1 ? "border-b-0" : ""
                  )}
                  onClick={() => handleViewDetails(record)}
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-700">
                          {record.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900" title={record.name}>
                          {truncate(record.name, 18)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="font-mono text-sm bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 inline-block">
                      {record.vehicleRegNo}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <StatusBadge status={record.status} />
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <time dateTime={record.date} className="text-slate-600 text-sm">
                      {record.date}
                    </time>
                  </TableCell>
                  
                  <TableCell className="py-4 pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group-hover:bg-blue-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(record)
                      }}
                      aria-label={`View details for ${record.name}`}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {isLoadingInitial && (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonRow key={`skeleton-${i}`} />
                  ))}
                </>
              )}

              {!isLoadingInitial && allItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">No records found</p>
                        <p className="text-sm text-slate-500 mt-1">
                          {localQuery ? "Try adjusting your search terms" : "No assistance history available"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div ref={loadMoreRef} className="py-4">
        {hasMore ? (
          isLoadingMore ? (
            <LoadingSpinner />
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-sm text-slate-600">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                Scroll to load more records
              </div>
            </div>
          )
        ) : allItems.length > 0 ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-500">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              You've reached the end of the history
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}