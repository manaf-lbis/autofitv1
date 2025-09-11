import { useState, useEffect, useRef } from "react"
import { MoreHorizontal, ArrowUpDown, Eye, CheckCircle, X, Search, Calendar, Mail, Phone, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useGetMechanicApplicationsQuery } from "../../../../services/adminServices/mechanicManagement"

type ApplicationStatus = "pending" | "approved" | "rejected" | "under_review"

interface MechanicApplication {
  id: string
  mechanicId: {
    id: string
    name: string
    email: string
    mobile: string
  }
  registration: {
    status: ApplicationStatus
  }
  createdAt: string
  experience: number
  specialised: string
  shopName: string
  place: string
}

interface StatusStyle {
  color: string
  label: string
}

const NewApplication: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [allApplications, setAllApplications] = useState<MechanicApplication[]>([])
  const navigate = useNavigate()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const { data, isLoading, isFetching } = useGetMechanicApplicationsQuery({ limit: 10, page })

  useEffect(() => {
    if (data?.data?.users) {
      setAllApplications((prev) => {
        const newApplications = data.data.users.filter(
          (newApp: MechanicApplication) => !prev.some((app) => app.id === newApp.id)
        )
        return [...prev, ...newApplications]
      })
    }
  }, [data])

  useEffect(() => {
    if (isLoading || isFetching || !data?.data?.totalPages || page >= data.data.totalPages) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isLoading, isFetching, data])

  const filteredData = allApplications.filter(
    (application) =>
      application.mechanicId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.mechanicId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.mechanicId.mobile.includes(searchTerm) ||
      application.specialised.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleDropdown = (applicationId: string) => {
    setOpenDropdown(openDropdown === applicationId ? null : applicationId)
  }

  const getStatusBadge = (status: ApplicationStatus | undefined) => {
    const statusStyles: Record<ApplicationStatus, StatusStyle> = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800 border-green-200", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
      under_review: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Under Review" },
    }

    // Fallback for undefined or unexpected status
    const { color, label } = statusStyles[status as ApplicationStatus] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: "Unknown",
    }

    return (
      <Badge variant="outline" className={`${color} text-xs`}>
        {label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Mechanic Applications</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Review and manage mechanic applications</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none transition-all placeholder-gray-400 text-sm"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-yellow-600" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {allApplications.filter((app) => app.registration.status === "pending").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-gray-500">Under Review</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {allApplications.filter((app) => app.registration.status === "under_review").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-xs text-gray-500">Approved</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {allApplications.filter((app) => app.registration.status === "approved").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-600" />
            <span className="text-xs text-gray-500">Rejected</span>
          </div>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {allApplications.filter((app) => app.registration.status === "rejected").length}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-300px)] sm:h-[calc(100vh-150px)]">
        <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[180px] sm:min-w-[200px]">
                  <button className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    <User className="h-4 w-4" />
                    Name
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[140px] sm:min-w-[160px]">
                  <button className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    <Calendar className="h-4 w-4" />
                    Date Applied
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[200px] sm:min-w-[250px]">
                  <button className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    <Mail className="h-4 w-4" />
                    Email
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[150px] sm:min-w-[180px]">
                  <button className="flex items-center gap-2 font-medium text-gray-700 text-xs sm:text-sm hover:text-gray-900 transition-colors">
                    <Phone className="h-4 w-4" />
                    Phone
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left min-w-[120px] sm:min-w-[140px]">
                  <span className="font-medium text-gray-700 text-xs sm:text-sm">Status</span>
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left w-16 sm:w-20">
                  <span className="font-medium text-gray-700 text-xs sm:text-sm">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 sm:px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="h-10 sm:h-12 w-10 sm:w-12 text-gray-300" />
                      <div>
                        <p className="text-base sm:text-lg font-medium">No applications found</p>
                        <p className="text-xs sm:text-sm mt-1">Try adjusting your search terms</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[180px] sm:min-w-[200px]">
                      <div>
                        <span className="text-gray-800 font-medium text-xs sm:text-sm">{application.mechanicId.name}</span>
                        <p className="text-xs text-gray-500 mt-1">{application.specialised}</p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[140px] sm:min-w-[160px] text-gray-600 text-xs sm:text-sm">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[200px] sm:min-w-[250px] text-gray-600 text-xs sm:text-sm">
                      {application.mechanicId.email}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[150px] sm:min-w-[180px] text-gray-600 font-mono text-xs sm:text-sm">
                      {application.mechanicId.mobile}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 min-w-[120px] sm:min-w-[140px]">
                      {getStatusBadge(application.registration.status)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 w-16 sm:w-20 relative">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => navigate(`/admin/mechanic-application/${application?.mechanicId.id}`)}
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <button
                          onClick={() => toggleDropdown(application.id)}
                          className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Open menu"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      {openDropdown === application.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                          <div className="absolute right-2 sm:right-4 top-8 sm:top-10 z-20 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                            <button className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </button>
                            <button className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                              <X className="h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {isLoading && (
            <div className="py-4 text-center text-gray-500">Loading...</div>
          )}
          {page < (data?.data?.totalPages || 1) && (
            <div ref={loadMoreRef} className="h-10" />
          )}
        </div>

        {/* Footer Section */}
        {filteredData.length > 0 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-600 gap-2">
              <p>Total {data?.data?.total || 0} applications</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-100">
                  {allApplications.filter((app) => app.registration.status === "pending").length} Pending
                </span>
                <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-100">
                  {allApplications.filter((app) => app.registration.status === "approved").length} Approved
                </span>
                <span className="text-xs bg-white px-2 py-1 rounded-full border border-gray-100">
                  {allApplications.filter((app) => app.registration.status === "rejected").length} Rejected
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewApplication