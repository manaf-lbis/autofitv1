import { Button } from '@/components/ui/button'
import { Briefcase, Calendar, Car, DollarSign, FileText, LayoutDashboard, Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import React from 'react'
import { cn } from "@/lib/utils"

const Dashboard = () => {
  return (
        <main className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Total Jobs", value: "248", change: "+12%", icon: Briefcase, color: "blue" },
              { title: "Completed", value: "182", change: "+8%", icon: Car, color: "green" },
              { title: "In Progress", value: "12", change: "+3%", icon: Wrench, color: "orange" },
              { title: "This Month", value: "$4,320", change: "+18%", icon: DollarSign, color: "purple" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/90 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      stat.color === "blue" && "bg-blue-50 text-blue-600",
                      stat.color === "green" && "bg-green-50 text-green-600",
                      stat.color === "orange" && "bg-orange-50 text-orange-600",
                      stat.color === "purple" && "bg-purple-50 text-purple-600",
                    )}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Jobs */}
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                    View All
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  {
                    id: "JOB-2458",
                    customer: "Alice Johnson",
                    vehicle: "2019 Honda Civic",
                    service: "Engine Repair",
                    status: "In Progress",
                    priority: "High",
                    time: "2h ago",
                  },
                  {
                    id: "JOB-2457",
                    customer: "Bob Smith",
                    vehicle: "2020 Toyota Camry",
                    service: "Oil Change",
                    status: "Completed",
                    priority: "Normal",
                    time: "4h ago",
                  },
                  {
                    id: "JOB-2456",
                    customer: "Carol Davis",
                    vehicle: "2018 Ford F-150",
                    service: "Brake Service",
                    status: "Scheduled",
                    priority: "High",
                    time: "1d ago",
                  },
                  {
                    id: "JOB-2455",
                    customer: "Dave Wilson",
                    vehicle: "2021 BMW X3",
                    service: "Tire Rotation",
                    status: "Completed",
                    priority: "Normal",
                    time: "2d ago",
                  },
                ].map((job, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <Car className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{job.customer}</p>
                            {job.priority === "High" && (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-200 text-xs">High Priority</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{job.vehicle}</p>
                          <p className="text-sm text-gray-500">
                            {job.service} • {job.id} • {job.time}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          job.status === "Completed" && "bg-green-100 text-green-800 hover:bg-green-200",
                          job.status === "In Progress" && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                          job.status === "Scheduled" && "bg-orange-100 text-orange-800 hover:bg-orange-200",
                        )}
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Today's Schedule */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/30">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { time: "9:00 AM", customer: "Mike Johnson", service: "Oil Change" },
                    { time: "11:30 AM", customer: "Sarah Wilson", service: "Brake Check" },
                    { time: "2:00 PM", customer: "Tom Brown", service: "Engine Diagnostic" },
                    { time: "4:30 PM", customer: "Lisa Davis", service: "Tire Replacement" },
                  ].map((appointment, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.customer} - {appointment.service}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/30">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    { title: "New Job", icon: Briefcase, color: "blue" },
                    { title: "Schedule Appointment", icon: Calendar, color: "green" },
                    { title: "Create Invoice", icon: FileText, color: "purple" },
                    { title: "View Reports", icon: LayoutDashboard, color: "orange" },
                  ].map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg mr-3",
                          action.color === "blue" && "bg-blue-50 text-blue-600",
                          action.color === "green" && "bg-green-50 text-green-600",
                          action.color === "purple" && "bg-purple-50 text-purple-600",
                          action.color === "orange" && "bg-orange-50 text-orange-600",
                        )}
                      >
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
  )
}

export default Dashboard