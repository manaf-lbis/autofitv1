// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import {
//   ArrowLeft,
//   Car,
//   MapPin,
//   Phone,
//   Calendar,
//   Clock,
//   User,
//   CreditCard,
//   CheckCircle,
//   AlertCircle,
//   Star,
//   MessageCircle,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"
// import { motion } from "framer-motion"

// // Mock service data
// const mockService = {
//   id: "SRV-001",
//   customer: "John Doe",
//   vehicle: "KL 23H8255",
//   plan: "premium",
//   status: "active",
//   date: "2025-01-22T10:00:00.000Z",
//   location: "Downtown Area, Kollam",
//   amount: 2500,
//   phone: "+91 9876543210",
//   description: "Premium checkup with detailed inspection and maintenance",
//   customerImage: "/placeholder.svg?height=80&width=80",
//   timeline: [
//     { id: 1, title: "Service Booked", time: "2025-01-20T14:30:00.000Z", status: "completed" },
//     { id: 2, title: "Mechanic Assigned", time: "2025-01-20T14:35:00.000Z", status: "completed" },
//     { id: 3, title: "Service Started", time: "2025-01-22T10:00:00.000Z", status: "active" },
//     { id: 4, title: "Service Completed", time: null, status: "pending" },
//     { id: 5, title: "Payment Processed", time: null, status: "pending" },
//   ],
//   notes: "Customer requested special attention to brake system. Vehicle has been making unusual noises.",
// }

// const PLANS = {
//   essential: { name: "Essential", color: "blue", duration: 120, price: 1500 },
//   premium: { name: "Premium", color: "purple", duration: 120, price: 2500 },
//   delight: { name: "Delight", color: "green", duration: 120, price: 3500 },
// }

// export default function ServiceDetailPage({ params }: { params: { id: string } }) {
//   const navigate = useNavigate()
//   const [service] = useState(mockService)
//   const [showNotes, setShowNotes] = useState(false)

//   const handleStatusUpdate = (newStatus: string) => {
//     // Handle status update logic here
//     console.log("Updating status to:", newStatus)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="w-full max-w-none px-6 py-8">
//         {/* Header */}
//         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
//           <div className="flex items-center gap-4 mb-4">
//             <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
//               <ArrowLeft className="w-4 h-4" />
//               Back
//             </Button>
//             <div className="h-6 w-px bg-gray-300"></div>
//             <h1 className="text-2xl font-bold text-gray-900">Service Details</h1>
//             <Badge
//               className={cn(
//                 "ml-auto",
//                 service.status === "active" && "bg-orange-100 text-orange-800 hover:bg-orange-100",
//                 service.status === "scheduled" && "bg-blue-100 text-blue-800 hover:bg-blue-100",
//                 service.status === "completed" && "bg-green-100 text-green-800 hover:bg-green-100",
//               )}
//             >
//               {service.status.toUpperCase()}
//             </Badge>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="xl:col-span-2 space-y-6"
//           >
//             {/* Service Overview */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
//                 <h2 className="text-xl font-semibold text-gray-900">Service Overview</h2>
//               </div>
//               <div className="p-6">
//                 <div className="flex items-start gap-6">
//                   <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
//                     <Car className="w-10 h-10 text-gray-600" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <h3 className="text-2xl font-bold text-gray-900">{service.vehicle}</h3>
//                       <Badge
//                         className={cn(
//                           "text-sm font-medium",
//                           PLANS[service.plan].color === "blue" && "bg-blue-100 text-blue-800 hover:bg-blue-100",
//                           PLANS[service.plan].color === "purple" && "bg-purple-100 text-purple-800 hover:bg-purple-100",
//                           PLANS[service.plan].color === "green" && "bg-green-100 text-green-800 hover:bg-green-100",
//                         )}
//                       >
//                         {PLANS[service.plan].name}
//                       </Badge>
//                     </div>
//                     <p className="text-gray-600 mb-4">{service.description}</p>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="w-4 h-4 text-gray-500" />
//                         <span className="text-sm text-gray-600">
//                           {new Date(service.date).toLocaleDateString("en-US", {
//                             weekday: "long",
//                             month: "long",
//                             day: "numeric",
//                             year: "numeric",
//                           })}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Clock className="w-4 h-4 text-gray-500" />
//                         <span className="text-sm text-gray-600">
//                           {new Date(service.date).toLocaleTimeString("en-US", {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}{" "}
//                           (2 hours)
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <MapPin className="w-4 h-4 text-gray-500" />
//                         <span className="text-sm text-gray-600">{service.location}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <CreditCard className="w-4 h-4 text-gray-500" />
//                         <span className="text-sm text-gray-600">₹{service.amount}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Service Timeline */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
//                 <h2 className="text-xl font-semibold text-gray-900">Service Timeline</h2>
//               </div>
//               <div className="p-6">
//                 <div className="relative">
//                   <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
//                   <div className="space-y-6">
//                     {service.timeline.map((step) => (
//                       <div key={step.id} className="relative flex items-start gap-4">
//                         <div
//                           className={cn(
//                             "w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white",
//                             step.status === "completed" && "border-green-500 bg-green-50",
//                             step.status === "active" && "border-blue-500 bg-blue-50",
//                             step.status === "pending" && "border-gray-300 bg-gray-50",
//                           )}
//                         >
//                           {step.status === "completed" && <CheckCircle className="w-4 h-4 text-green-600" />}
//                           {step.status === "active" && <AlertCircle className="w-4 h-4 text-blue-600" />}
//                           {step.status === "pending" && <Clock className="w-4 h-4 text-gray-400" />}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center justify-between">
//                             <p
//                               className={cn(
//                                 "font-medium",
//                                 step.status === "completed" && "text-green-900",
//                                 step.status === "active" && "text-blue-900",
//                                 step.status === "pending" && "text-gray-500",
//                               )}
//                             >
//                               {step.title}
//                             </p>
//                             {step.time && (
//                               <p className="text-sm text-gray-500">
//                                 {new Date(step.time).toLocaleString("en-US", {
//                                   month: "short",
//                                   day: "numeric",
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                 })}
//                               </p>
//                             )}
//                           </div>
//                           {step.status === "active" && (
//                             <p className="text-sm text-blue-600 mt-1">Currently in progress...</p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Notes Section */}
//             {service.notes && (
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
//                   <h2 className="text-xl font-semibold text-gray-900">Service Notes</h2>
//                 </div>
//                 <div className="p-6">
//                   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                     <p className="text-gray-700">{service.notes}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </motion.div>

//           {/* Sidebar */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="xl:col-span-1 space-y-6"
//           >
//             {/* Customer Info */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
//                 <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
//               </div>
//               <div className="p-6">
//                 <div className="flex items-center gap-4 mb-4">
//                   <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
//                     <User className="w-8 h-8 text-gray-600" />
//                   </div>
//                   <div>
//                     <h4 className="text-lg font-semibold text-gray-900">{service.customer}</h4>
//                     <p className="text-sm text-gray-600">Vehicle Owner</p>
//                   </div>
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-2">
//                     <Phone className="w-4 h-4 text-gray-500" />
//                     <span className="text-sm text-gray-600">{service.phone}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Car className="w-4 h-4 text-gray-500" />
//                     <span className="text-sm text-gray-600 font-mono">{service.vehicle}</span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 mt-4">
//                   <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                     <Phone className="w-4 h-4 mr-1" />
//                     Call
//                   </Button>
//                   <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                     <MessageCircle className="w-4 h-4 mr-1" />
//                     Message
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
//                 <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
//               </div>
//               <div className="p-6 space-y-3">
//                 {service.status === "active" && (
//                   <>
//                     <Button onClick={() => handleStatusUpdate("completed")} className="w-full justify-start" size="lg">
//                       <CheckCircle className="w-4 h-4 mr-2" />
//                       Mark as Completed
//                     </Button>
//                     <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
//                       <Clock className="w-4 h-4 mr-2" />
//                       Update Progress
//                     </Button>
//                   </>
//                 )}
//                 {service.status === "scheduled" && (
//                   <Button onClick={() => handleStatusUpdate("active")} className="w-full justify-start" size="lg">
//                     <AlertCircle className="w-4 h-4 mr-2" />
//                     Start Service
//                   </Button>
//                 )}
//                 <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
//                   <Star className="w-4 h-4 mr-2" />
//                   Add Rating
//                 </Button>
//               </div>
//             </div>

//             {/* Service Summary */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
//                 <h3 className="text-lg font-semibold text-gray-900">Service Summary</h3>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Service ID</span>
//                   <span className="text-sm font-medium text-gray-900">{service.id}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Plan</span>
//                   <span className="text-sm font-medium text-gray-900">{PLANS[service.plan].name}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Duration</span>
//                   <span className="text-sm font-medium text-gray-900">2 hours</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-600">Amount</span>
//                   <span className="text-sm font-medium text-gray-900">₹{service.amount}</span>
//                 </div>
//                 <div className="pt-4 border-t border-gray-100">
//                   <div className="flex justify-between">
//                     <span className="font-medium text-gray-900">Total</span>
//                     <span className="text-lg font-bold text-gray-900">₹{service.amount}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   )
// }
