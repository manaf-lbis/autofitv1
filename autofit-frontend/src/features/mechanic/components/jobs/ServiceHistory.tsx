import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, MapPin, Clock, Star, Activity, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Service, Plan } from "@/types/availability"

// Plan configurations
const PLANS: Record<string, Plan> = {
  essential: { name: "Essential", color: "blue", duration: 120, price: 1500 },
  premium: { name: "Premium", color: "purple", duration: 120, price: 2500 },
  delight: { name: "Delight", color: "green", duration: 120, price: 3500 },
}

// Focused mock services - only active and completed
const mockServices: Service[] = [
  {
    id: "SRV-001",
    customer: "Rajesh Kumar",
    vehicle: "KL 07 AB 1234",
    plan: "premium",
    status: "active",
    date: "2025-01-22T08:00:00.000Z",
    location: "Downtown Area, Kollam",
    amount: 2500,
    phone: "+91 9876543210",
    description: "Premium checkup with detailed inspection - Currently in progress",
  },
  {
    id: "SRV-026",
    customer: "Priya Nair",
    vehicle: "KL 23 H 8255",
    plan: "delight",
    status: "active",
    date: "2025-01-22T10:00:00.000Z",
    location: "Suburb Area, Kollam",
    amount: 3500,
    phone: "+91 9876543211",
    description: "Complete delight package with premium services - In progress",
  },
  {
    id: "SRV-027",
    customer: "Deepa Krishnan",
    vehicle: "KL 56 E 7890",
    plan: "premium",
    status: "active",
    date: "2025-01-24T08:00:00.000Z",
    location: "Temple Road, Kollam",
    amount: 2500,
    phone: "+91 9876543217",
    description: "Premium service with detailed inspection - Currently active",
  },
  {
    id: "SRV-008",
    customer: "Arun Nair",
    vehicle: "KL 78 F 1234",
    plan: "delight",
    status: "completed",
    date: "2025-01-20T12:00:00.000Z",
    location: "Railway Station, Kollam",
    amount: 3500,
    phone: "+91 9876543218",
    description: "Completed delight package service with full vehicle inspection",
  },
  {
    id: "SRV-009",
    customer: "Meera Sasi",
    vehicle: "KL 90 G 5678",
    plan: "essential",
    status: "completed",
    date: "2025-01-19T16:00:00.000Z",
    location: "Hospital Junction, Kollam",
    amount: 1500,
    phone: "+91 9876543219",
    description: "Completed essential service with tire rotation",
  },
  {
    id: "SRV-017",
    customer: "Krishnan Nair",
    vehicle: "KL 45 Q 7890",
    plan: "essential",
    status: "completed",
    date: "2025-01-18T14:00:00.000Z",
    location: "Fish Market, Kollam",
    amount: 1500,
    phone: "+91 9876543227",
    description: "Completed essential service with oil filter replacement",
  },
  {
    id: "SRV-018",
    customer: "Maya Devi",
    vehicle: "KL 67 R 1234",
    plan: "premium",
    status: "completed",
    date: "2025-01-17T10:00:00.000Z",
    location: "Church Road, Kollam",
    amount: 2500,
    phone: "+91 9876543228",
    description: "Completed premium service with suspension check",
  },
  {
    id: "SRV-019",
    customer: "Ravi Kumar",
    vehicle: "KL 89 S 5678",
    plan: "delight",
    status: "completed",
    date: "2025-01-16T16:00:00.000Z",
    location: "Boat Jetty, Kollam",
    amount: 3500,
    phone: "+91 9876543229",
    description: "Completed delight package with comprehensive diagnostics",
  },
  {
    id: "SRV-021",
    customer: "Sunil Varma",
    vehicle: "KL 34 U 3456",
    plan: "premium",
    status: "completed",
    date: "2025-01-14T16:00:00.000Z",
    location: "Medical College, Kollam",
    amount: 2500,
    phone: "+91 9876543231",
    description: "Completed premium service with engine diagnostics",
  },
  {
    id: "SRV-022",
    customer: "Geetha Nair",
    vehicle: "KL 56 V 7890",
    plan: "delight",
    status: "completed",
    date: "2025-01-13T12:00:00.000Z",
    location: "Collectorate, Kollam",
    amount: 3500,
    phone: "+91 9876543232",
    description: "Completed delight package with full system check",
  },
  {
    id: "SRV-023",
    customer: "Mohan Das",
    vehicle: "KL 78 W 1234",
    plan: "essential",
    status: "completed",
    date: "2025-01-12T10:00:00.000Z",
    location: "KSRTC Stand, Kollam",
    amount: 1500,
    phone: "+91 9876543233",
    description: "Completed essential service with brake adjustment",
  },
  {
    id: "SRV-024",
    customer: "Shanti Devi",
    vehicle: "KL 90 X 5678",
    plan: "premium",
    status: "completed",
    date: "2025-01-11T14:00:00.000Z",
    location: "Ashramam, Kollam",
    amount: 2500,
    phone: "+91 9876543234",
    description: "Completed premium service with AC repair",
  },
]

interface ServiceHistoryProps {
  loading?: boolean
}

export function ServiceHistory({ loading = false }: ServiceHistoryProps) {
  const navigate = useNavigate()
  const [services] = useState<Service[]>(mockServices)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Filter services based on search and status (only active and completed)
  const filteredServices = services.filter((service: Service) => {
    const matchesSearch =
      service.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.plan.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || service.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Navigate to service detail
  const handleServiceClick = (serviceId: string): void => {
    navigate(`/services/${serviceId}`)
  }

  if (loading) {
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
            <h3 className="text-lg font-semibold text-gray-900">Service History</h3>
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

      {/* Scrollable Service Cards Grid */}
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
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-lg cursor-pointer hover:border-blue-300 group transition-all bg-white"
                  onClick={() => handleServiceClick(service.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0">
                        {service.status === "active" ? (
                          <Activity className="w-6 h-6 text-orange-600 group-hover:text-blue-600" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-green-600 group-hover:text-blue-600" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-900 text-sm truncate">
                          {service.customer}
                        </p>
                        <p className="text-xs font-mono text-gray-600 truncate">{service.vehicle}</p>
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "text-xs font-medium shadow-sm flex-shrink-0",
                        service.status === "active" && "bg-orange-100 text-orange-800 hover:bg-orange-100",
                        service.status === "completed" && "bg-green-100 text-green-800 hover:bg-green-100",
                      )}
                    >
                      {service.status === "active" ? "In Progress" : "Completed"}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{service.location}</span>
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(service.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {PLANS[service.plan].name}
                    </Badge>
                    <p className="text-sm font-bold text-gray-900">₹{service.amount}</p>
                  </div>

                  {service.status === "completed" && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  )}

                  {service.status === "active" && (
                    <div className="flex items-center justify-end pt-2 border-t border-gray-100">
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
