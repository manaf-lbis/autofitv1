import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  Clock,
  MapPin,
  Navigation,
  CheckCircle,
  Wrench,
  Calendar,
  Activity,
  Eye,
  ChevronRight,
  Car,
  User,
} from "lucide-react"

export default function MechanicDashboard() {
  const [activeTab, setActiveTab] = useState("emergency")
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("")


  const recentActivities = [
    { id: 1, client: "Sarah Johnson", action: "Engine overheating resolved", time: "2h ago" },
    { id: 2, client: "Mike Davis", action: "Scheduled pickup completed", time: "4h ago" },
    { id: 3, client: "Lisa Chen", action: "Brake inspection finished", time: "6h ago" },
    { id: 4, client: "Tom Wilson", action: "Flat tire assistance", time: "8h ago" },
    { id: 5, client: "Anna Brown", action: "Oil change scheduled", time: "1d ago" },
    { id: 6, client: "John Smith", action: "Battery replacement done", time: "1d ago" },
    { id: 7, client: "Emma Taylor", action: "Towing service provided", time: "2d ago" },
    { id: 8, client: "David Lee", action: "Maintenance checkup", time: "2d ago" },
    { id: 9, client: "Sophie Miller", action: "Transmission repair", time: "3d ago" },
    { id: 10, client: "Ryan Garcia", action: "Jump start assistance", time: "3d ago" },
  ]

  const emergencyRequest = {
    name: "Sarah Johnson",
    issue: "Engine overheating",
    description: "Car started overheating on the highway, steam coming from hood",
    location: "Highway 101, Mile Marker 45",
    time: "12m ago",
    distance: "2.3 mi",
  }

  const pickupRequests = [
    {
      id: 1,
      slot: "9:00 AM",
      name: "Mike Davis",
      vehicle: "Honda Civic 2019",
      location: "123 Main St, Downtown",
      details: "Regular maintenance checkup",
    },
    {
      id: 2,
      slot: "11:00 AM",
      name: "Lisa Chen",
      vehicle: "Toyota Camry 2020",
      location: "456 Oak Ave, Midtown",
      details: "Brake inspection and oil change",
    },
    {
      id: 3,
      slot: "2:00 PM",
      name: "Available",
      vehicle: "",
      location: "",
      details: "",
    },
    {
      id: 4,
      slot: "4:00 PM",
      name: "Available",
      vehicle: "",
      location: "",
      details: "",
    },
  ]

  const workInProgress = [
    {
      id: 1,
      name: "Tom Wilson",
      vehicle: "Ford F-150 2018",
      issue: "Transmission repair",
      startTime: "Started 2h ago",
      location: "Workshop Bay 2",
    },
    {
      id: 2,
      name: "Anna Brown",
      vehicle: "BMW X3 2021",
      issue: "Engine diagnostic",
      startTime: "Started 45m ago",
      location: "Workshop Bay 1",
    },
  ]

  const completedJobs = [
    {
      id: 1,
      name: "John Smith",
      vehicle: "Nissan Altima 2019",
      issue: "Battery replacement",
      completedTime: "Completed 30m ago",
      location: "Customer Location",
    },
    {
      id: 2,
      name: "Emma Taylor",
      vehicle: "Chevrolet Malibu 2020",
      issue: "Oil change and filter",
      completedTime: "Completed 1h ago",
      location: "Customer Location",
    },
  ]

  const handleNavigate = (location: string) => {
    setSelectedLocation(location)
    setIsLocationModalOpen(true)
  }

  const getTabBadgeCount = (tabId: string) => {
    switch (tabId) {
      case "emergency":
        return 1
      case "pickup":
        return pickupRequests.filter((r) => r.name !== "Available").length
      case "progress":
        return workInProgress.length
      case "completed":
        return completedJobs.length
      default:
        return 0
    }
  }

  const tabs = [
    { id: "emergency", label: "Emergency", icon: AlertTriangle },
    { id: "pickup", label: "Pickup", icon: Calendar },
    { id: "progress", label: "Progress", icon: Wrench },
    { id: "completed", label: "Completed", icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="p-4">
          {/* Tab Navigation for Mobile */}
          <div className="bg-white rounded-lg shadow-sm border mb-4">
            <div className="p-4">
              <div className="grid grid-cols-4 gap-2 bg-gray-50 p-1 rounded-md">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const badgeCount = getTabBadgeCount(tab.id)
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-2 py-3 rounded-md text-xs font-medium transition-colors ${
                        activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                      {badgeCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {badgeCount}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile Content */}
          <div className="space-y-4">
            {/* Emergency Tab */}
            {activeTab === "emergency" && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-600" />
                        <h3 className="font-bold text-gray-900">{emergencyRequest.name}</h3>
                      </div>
                      <p className="text-red-600 font-medium text-sm">{emergencyRequest.issue}</p>
                    </div>
                  </div>
                  <Badge className="bg-red-500 text-white text-xs">URGENT</Badge>
                </div>

                <p className="text-gray-700 mb-4 text-sm">{emergencyRequest.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 text-sm">{emergencyRequest.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{emergencyRequest.time}</span>
                    </div>
                    <span>•</span>
                    <span>{emergencyRequest.distance}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleNavigate(emergencyRequest.location)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm"
                    size="sm"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Navigate
                  </Button>
                  <Button variant="outline" size="sm" className="text-sm">
                    Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Pickup Request Tab */}
            {activeTab === "pickup" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Today's Schedule</h3>
                </div>
                {pickupRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`rounded-lg shadow-sm border p-4 ${
                      request.name !== "Available" ? "bg-blue-50 border-blue-200" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {request.slot}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {request.name !== "Available" && <User className="w-4 h-4 text-gray-600" />}
                            <h4 className="font-bold text-gray-900 text-sm">
                              {request.name === "Available" ? "Available Slot" : request.name}
                            </h4>
                          </div>
                          {request.vehicle && (
                            <div className="flex items-center gap-1">
                              <Car className="w-3 h-3 text-gray-500" />
                              <p className="text-gray-600 text-xs">{request.vehicle}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {request.name !== "Available" && (
                        <Badge className="bg-blue-500 text-white text-xs">Scheduled</Badge>
                      )}
                    </div>

                    {request.location && (
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 text-xs">{request.location}</span>
                      </div>
                    )}

                    {request.details && <p className="text-gray-600 mb-3 text-sm">{request.details}</p>}

                    {request.name !== "Available" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleNavigate(request.location)}
                          className="bg-blue-500 hover:bg-blue-600 text-sm"
                        >
                          <Navigation className="w-4 h-4 mr-1" />
                          Navigate
                        </Button>
                        <Button size="sm" variant="outline" className="text-sm">
                          Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Work Progress Tab */}
            {activeTab === "progress" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Active Jobs</h3>
                </div>
                {workInProgress.map((work) => (
                  <div key={work.id} className="bg-orange-50 border-2 border-orange-200 rounded-lg shadow-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-600" />
                          <h4 className="font-bold text-gray-900 text-sm">{work.name}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="w-3 h-3 text-gray-500" />
                          <p className="text-gray-600 text-xs">{work.vehicle}</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-500 text-white text-xs">In Progress</Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Wrench className="w-4 h-4 text-orange-600" />
                      <p className="font-medium text-gray-900 text-sm">{work.issue}</p>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{work.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{work.location}</span>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Tab */}
            {activeTab === "completed" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Completed Today</h3>
                </div>
                {completedJobs.map((job) => (
                  <div key={job.id} className="bg-green-50 border-2 border-green-200 rounded-lg shadow-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-600" />
                          <h4 className="font-bold text-gray-900 text-sm">{job.name}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="w-3 h-3 text-gray-500" />
                          <p className="text-gray-600 text-xs">{job.vehicle}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500 text-white text-xs">Completed</Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="font-medium text-gray-900 text-sm">{job.issue}</p>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{job.completedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleNavigate(job.location)}
                        className="bg-green-500 hover:bg-green-600 text-sm"
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Navigate
                      </Button>
                      <Button size="sm" variant="outline" className="text-sm">
                        Start Return
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity for Mobile */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-600" />
                <h2 className="font-semibold text-gray-900">Recent Activity</h2>
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              <div className="p-3 space-y-2">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-gray-900 text-sm">{activity.client}</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs">{activity.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex h-screen">
          {/* Recent Activity Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-gray-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="p-4 space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-900 text-sm">{activity.client}</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{activity.action}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white">
            {/* Tab Navigation */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex space-x-1 bg-gray-50 p-1 rounded-lg">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const badgeCount = getTabBadgeCount(tab.id)
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {badgeCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {badgeCount}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Desktop Content */}
            <ScrollArea className="h-[calc(100vh-140px)]">
              <div className="p-6">
                {/* Emergency Tab */}
                {activeTab === "emergency" && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">{emergencyRequest.name}</h3>
                          </div>
                          <p className="text-red-600 font-medium">{emergencyRequest.issue}</p>
                        </div>
                      </div>
                      <Badge className="bg-red-500 text-white">URGENT</Badge>
                    </div>

                    <p className="text-gray-700 mb-4">{emergencyRequest.description}</p>

                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{emergencyRequest.location}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{emergencyRequest.time}</span>
                      </div>
                      <span>•</span>
                      <span>{emergencyRequest.distance}</span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleNavigate(emergencyRequest.location)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                      <Button variant="outline">
                        Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Pickup Request Tab */}
                {activeTab === "pickup" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                    {pickupRequests.map((request) => (
                      <div
                        key={request.id}
                        className={`rounded-lg p-6 ${
                          request.name !== "Available" ? "bg-blue-50 border-2 border-blue-200" : "border"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-medium text-sm flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {request.slot}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {request.name !== "Available" && <User className="w-4 h-4 text-gray-600" />}
                                <h4 className="font-semibold text-gray-900">
                                  {request.name === "Available" ? "Available Slot" : request.name}
                                </h4>
                              </div>
                              {request.vehicle && (
                                <div className="flex items-center gap-1">
                                  <Car className="w-4 h-4 text-gray-500" />
                                  <p className="text-gray-600 text-sm">{request.vehicle}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {request.name !== "Available" && <Badge className="bg-blue-500 text-white">Scheduled</Badge>}
                        </div>

                        {request.location && (
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{request.location}</span>
                          </div>
                        )}

                        {request.details && <p className="text-gray-700 mb-4">{request.details}</p>}

                        {request.name !== "Available" && (
                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              onClick={() => handleNavigate(request.location)}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              <Navigation className="w-4 h-4 mr-2" />
                              Navigate
                            </Button>
                            <Button size="sm" variant="outline">
                              Details
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Work Progress Tab */}
                {activeTab === "progress" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Active Jobs</h3>
                    {workInProgress.map((work) => (
                      <div key={work.id} className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-gray-600" />
                              <h4 className="font-semibold text-gray-900">{work.name}</h4>
                            </div>
                            <div className="flex items-center gap-1">
                              <Car className="w-4 h-4 text-gray-500" />
                              <p className="text-gray-600 text-sm">{work.vehicle}</p>
                            </div>
                          </div>
                          <Badge className="bg-orange-500 text-white">In Progress</Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <Wrench className="w-4 h-4 text-orange-600" />
                          <p className="font-medium text-gray-900">{work.issue}</p>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{work.startTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{work.location}</span>
                          </div>
                        </div>

                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Completed Tab */}
                {activeTab === "completed" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Completed Today</h3>
                    {completedJobs.map((job) => (
                      <div key={job.id} className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-gray-600" />
                              <h4 className="font-semibold text-gray-900">{job.name}</h4>
                            </div>
                            <div className="flex items-center gap-1">
                              <Car className="w-4 h-4 text-gray-500" />
                              <p className="text-gray-600 text-sm">{job.vehicle}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-500 text-white">Completed</Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <p className="font-medium text-gray-900">{job.issue}</p>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{job.completedTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            onClick={() => handleNavigate(job.location)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Navigate
                          </Button>
                          <Button size="sm" variant="outline">
                            Start Return
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Enhanced Location Modal */}
      <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Navigation className="w-4 h-4 text-blue-600" />
              </div>
              Navigation to Location
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">Interactive Map</p>
                <p className="text-gray-400 text-sm">Location: {selectedLocation}</p>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-gray-600 font-medium">Destination:</p>
              </div>
              <p className="font-semibold text-gray-900">{selectedLocation}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                <Navigation className="w-4 h-4 mr-2" />
                Open in Google Maps
              </Button>
              <Button variant="outline" className="flex-1">
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
