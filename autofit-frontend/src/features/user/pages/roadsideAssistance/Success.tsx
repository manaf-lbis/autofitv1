"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  FileText,
  CreditCard,
  ArrowLeft,
  Car,
  PenToolIcon as Tool,
  Shield,
  CheckSquare,
  X,
  MessageCircle,
  Clock,
  Calendar,
  Info,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Mock data for the booking success page
const bookingData = {
  id: "BK-78945",
  status: "confirmed",
  createdAt: "2025-06-13T14:31:55.000Z",
  mechanic: {
    id: "MECH-123",
    name: "Mechanic World",
    photo: "/placeholder.svg?height=80&width=80",
    rating: 4.5,
    specialization: "Engine Mechanic",
    location: {
      address: "Kollam, Kerala",
      coordinates: [76.5470070840698, 9.176052400784215],
    },
    phone: "+91 7094414155",
    status: "en-route", // en-route, arrived, working, completed
    estimatedArrival: "5 minutes",
  },
  vehicle: {
    make: "Tata",
    model: "Punch",
    registration: "KL 23H8255",
    type: "Diesel",
  },
  issue: {
    description: "Engine not starting, battery seems dead",
    category: "Battery Issue",
    severity: "High",
  },
  payment: {
    status: "pending", // pending, completed, failed
    method: "Credit Card",
    amount: 1500,
    currency: "INR",
    transactionId: "TXN-456789",
    timestamp: "2025-06-13T14:35:22.000Z",
  },
  quotation: {
    status: "generated", // not-generated, generated, accepted, rejected
    amount: 2500,
    currency: "INR",
    items: [
      { slNo: 1, name: "Battery Replacement", qty: 1, price: 1800, total: 1800 },
      { slNo: 2, name: "Service Charge", qty: 1, price: 500, total: 500 },
      { slNo: 3, name: "GST (18%)", qty: 1, price: 200, total: 200 },
    ],
    notes: "Battery warranty: 1 year",
  },
  timeline: [
    {
      id: 1,
      title: "Booking Confirmed",
      time: "2025-06-13T14:31:55.000Z",
      status: "completed",
      icon: CheckCircle,
    },
    {
      id: 2,
      title: "Mechanic Assigned",
      time: "2025-06-13T14:33:55.000Z",
      status: "completed",
      icon: CheckSquare,
    },
    {
      id: 3,
      title: "Mechanic En Route",
      time: "2025-06-13T14:34:55.000Z",
      status: "active",
      icon: Car,
    },
    {
      id: 4,
      title: "Service Started",
      time: null,
      status: "pending",
      icon: Tool,
    },
    {
      id: 5,
      title: "Service Completed",
      time: null,
      status: "pending",
      icon: Shield,
    },
  ],
}

export default function BookingSuccessPage() {
  const [activeTab, setActiveTab] = useState("details")
  const [showQuotationModal, setShowQuotationModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(3) // Based on the timeline data
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const [isPaymentComplete, setIsPaymentComplete] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)

  // Simulate progress for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < bookingData.timeline.length && Math.random() > 0.7) {
        setCurrentStep((prev) => prev + 1)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [currentStep])

  const handleAcceptAndPay = () => {
    setIsPaymentProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsPaymentProcessing(false)
      setIsPaymentComplete(true)
      setShowQuotationModal(false)
    }, 2000)
  }

  const handleCancelBooking = () => {
    setIsCancelling(true)
    // Simulate cancellation processing
    setTimeout(() => {
      setIsCancelling(false)
      setIsCancelled(true)
      setShowCancelModal(false)
    }, 1500)
  }

  // Format date and time
  const formatDateTime = (dateString: any) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-16 from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">

      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 relative">
        <div className="mb-4">
          <Link to="/booking" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm">Back</span>
          </Link>
        </div>

        {/* Improved Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg p-6 mb-5 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h1>
              <p className="text-gray-600">Your mechanic is on the way to help you.</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-2 py-1">
                  {bookingData.timeline[currentStep - 1]?.title}
                </Badge>
                <div className="h-4 w-px bg-gray-200"></div>
                <span className="text-sm text-gray-600">ETA: {bookingData.mechanic.estimatedArrival}</span>
                <div className="h-4 w-px bg-gray-200"></div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">ID: {bookingData.id}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setShowCancelModal(true)}
                disabled={isCancelled}
              >
                <XCircle className="w-4 h-4" />
                {isCancelled ? "Cancelled" : "Cancel"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 mb-4 gap-2">
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
              activeTab === "details"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded-t-lg",
            )}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
              activeTab === "map"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded-t-lg",
            )}
            onClick={() => setActiveTab("map")}
          >
            Track
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
              activeTab === "payment"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded-t-lg",
            )}
            onClick={() => setActiveTab("payment")}
          >
            Payment
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Always visible */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            {/* Mechanic Info Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4">
              <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
                <h3 className="text-sm font-medium text-gray-700">Assigned Mechanic</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-blue-100">
                    <img
                      src={bookingData.mechanic.photo || "/placeholder.svg"}
                      alt={bookingData.mechanic.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{bookingData.mechanic.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{bookingData.mechanic.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{bookingData.mechanic.specialization}</span>
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {bookingData.mechanic.location.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 mt-2 border-t border-gray-100"></div>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4">
              <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
                <h3 className="text-sm font-medium text-gray-700">Vehicle Information</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Make & Model</span>
                    <span className="text-xs font-medium text-gray-900">
                      {bookingData.vehicle.make} {bookingData.vehicle.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Registration</span>
                    <span className="text-xs font-medium text-gray-900">{bookingData.vehicle.registration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Fuel Type</span>
                    <span className="text-xs font-medium text-gray-900">{bookingData.vehicle.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Info Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
                <h3 className="text-sm font-medium text-gray-700">Issue Details</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-600">Description</span>
                    <p className="text-xs font-medium text-gray-900 mt-0.5">{bookingData.issue.description}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Category</span>
                    <span className="text-xs font-medium text-gray-900">{bookingData.issue.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Severity</span>
                    <Badge
                      className={cn(
                        "text-[10px] py-0 px-2 h-5",
                        bookingData.issue.severity === "High" && "bg-red-100 text-red-800 hover:bg-red-100",
                        bookingData.issue.severity === "Medium" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
                        bookingData.issue.severity === "Low" && "bg-green-100 text-green-800 hover:bg-green-100",
                      )}
                    >
                      {bookingData.issue.severity}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {activeTab === "details" && (
              <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
                  <h3 className="text-sm font-medium text-gray-700">Booking Summary</h3>
                </div>
                <div className="p-5">
                  {/* Modern Status Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        {/* { bookingData.timeline[currentStep - 1]?.icon && ( <bookingData.timeline[currentStep - 1].icon className="w-5 h-5 text-blue-600" />  )} */}
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">
                          {bookingData.timeline[currentStep - 1]?.title || "Processing"}
                        </h4>
                        <p className="text-sm text-blue-700 mt-0.5">
                          {currentStep === 3
                            ? "Your mechanic is on the way and will arrive in approximately " +
                              bookingData.mechanic.estimatedArrival
                            : currentStep === 4
                              ? "The mechanic has arrived and is diagnosing your vehicle issue"
                              : currentStep === 5
                                ? "Service has been completed successfully"
                                : "Your booking is being processed"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-100">
                      <div className="flex items-center gap-1 text-sm text-blue-700">
                        <Clock className="w-4 h-4" />
                        <span>ETA: {bookingData.mechanic.estimatedArrival}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-blue-700">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(bookingData.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <Info className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Booking Details</h4>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs flex justify-between">
                            <span className="text-gray-500">Booking ID:</span>
                            <span className="font-medium text-gray-900">{bookingData.id}</span>
                          </p>
                          <p className="text-xs flex justify-between">
                            <span className="text-gray-500">Service Type:</span>
                            <span className="font-medium text-gray-900">Emergency Roadside</span>
                          </p>
                          <p className="text-xs flex justify-between">
                            <span className="text-gray-500">Payment Status:</span>
                            <span className="font-medium text-gray-900">{isPaymentComplete ? "Paid" : "Pending"}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <Car className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Vehicle Details</h4>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs flex justify-between">
                            <span className="text-gray-500">Make & Model:</span>
                            <span className="font-medium text-gray-900">
                              {bookingData.vehicle.make} {bookingData.vehicle.model}
                            </span>
                          </p>
                          <p className="text-xs flex justify-between">
                            <span className="text-gray-500">Registration:</span>
                            <span className="font-medium text-gray-900">{bookingData.vehicle.registration}</span>
                          </p>
                          <p className="text-xs flex justify-between">
                            <span className="text-gray-500">Issue:</span>
                            <span className="font-medium text-gray-900">{bookingData.issue.category}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Steps - Modern Design */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Service Timeline</h4>
                    <div className="space-y-3">
                      {bookingData.timeline.map((step, index) => (
                        <div
                          key={step.id}
                          className={cn(
                            "flex items-center p-3 rounded-lg border",
                            step.status === "completed" && "bg-green-50/50 border-green-100",
                            step.status === "active" && "bg-blue-50/50 border-blue-100",
                            step.status === "pending" && "bg-gray-50/50 border-gray-100",
                          )}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                              step.status === "completed" && "bg-green-100",
                              step.status === "active" && "bg-blue-100",
                              step.status === "pending" && "bg-gray-100",
                            )}
                          >
                            {step.icon && (
                              <step.icon
                                className={cn(
                                  "w-4 h-4",
                                  step.status === "completed" && "text-green-600",
                                  step.status === "active" && "text-blue-600",
                                  step.status === "pending" && "text-gray-400",
                                )}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  step.status === "completed" && "text-green-900",
                                  step.status === "active" && "text-blue-900",
                                  step.status === "pending" && "text-gray-500",
                                )}
                              >
                                {step.title}
                              </p>
                              {step.time ? (
                                <p className="text-xs text-gray-500">{formatDateTime(step.time)}</p>
                              ) : (
                                <p className="text-xs text-gray-400">Pending</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {bookingData.quotation.status === "generated" && (
                      <Button
                        onClick={() => setShowQuotationModal(true)}
                        className="flex-1 text-sm h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Service Quotation
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => setShowCancelModal(true)}
                      className="flex-1 text-sm h-10 text-red-600 border-red-200 hover:bg-red-50"
                      disabled={isCancelled}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {isCancelled ? "Service Cancelled" : "Cancel Service"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "map" && (
              <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
                  <h3 className="text-sm font-medium text-gray-700">Track Mechanic</h3>
                </div>
                <div className="p-4">
                  <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-100 rounded-lg overflow-hidden relative">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${bookingData.mechanic.location.coordinates[1]},${bookingData.mechanic.location.coordinates[0]}&zoom=15`}
                    ></iframe>
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-3 left-3 bg-white rounded-lg shadow-md p-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                          <img
                            src={bookingData.mechanic.photo || "/placeholder.svg"}
                            alt={bookingData.mechanic.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-900">{bookingData.mechanic.name}</p>
                          <p className="text-[10px] text-gray-600">ETA: {bookingData.mechanic.estimatedArrival}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-2">
                      <div className="text-blue-600 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">Live Tracking</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Location updates every 30 seconds. You'll be notified when the mechanic is about to arrive.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-4">
                {/* Payment Information */}
                <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
                    <h3 className="text-sm font-medium text-gray-700">Payment Information</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          isPaymentComplete
                            ? "bg-green-100"
                            : bookingData.payment.status === "pending"
                              ? "bg-yellow-100"
                              : "bg-red-100",
                        )}
                      >
                        <CreditCard
                          className={cn(
                            "w-4 h-4",
                            isPaymentComplete
                              ? "text-green-600"
                              : bookingData.payment.status === "pending"
                                ? "text-yellow-600"
                                : "text-red-600",
                          )}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Payment {isPaymentComplete ? "Completed" : "Pending"}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {isPaymentComplete
                            ? `Paid on ${formatDateTime(new Date())}`
                            : "Payment will be processed after you accept the quotation"}
                        </p>
                      </div>
                    </div>

                    {isPaymentComplete && (
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Payment Method</span>
                          <span className="text-xs font-medium text-gray-900">{bookingData.payment.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Amount Paid</span>
                          <span className="text-xs font-medium text-gray-900">
                            {bookingData.payment.currency} {bookingData.quotation.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Transaction ID</span>
                          <span className="text-xs font-medium text-gray-900">{bookingData.payment.transactionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Payment Date</span>
                          <span className="text-xs font-medium text-gray-900">
                            {formatDateTime(bookingData.payment.timestamp)}
                          </span>
                        </div>
                      </div>
                    )}

                    {!isPaymentComplete && (
                      <div className="mt-3">
                        <Button onClick={() => setShowQuotationModal(true)} className="w-full text-sm h-9">
                          View & Accept Quotation
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quotation Information */}
                <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
                    <h3 className="text-sm font-medium text-gray-700">Service Quotation</h3>
                  </div>
                  <div className="p-4">
                    {bookingData.quotation.status === "not-generated" ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Quotation Not Generated Yet</h4>
                          <p className="text-xs text-gray-600">
                            The mechanic will provide a quotation after diagnosing the issue.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900">
                              {bookingData.timeline[currentStep - 1]?.title || "Processing"}
                            </h4>
                            <p className="text-xs text-blue-700 mt-0.5">
                              {currentStep === 3
                                ? "Your mechanic is on the way and will arrive in approximately " +
                                  bookingData.mechanic.estimatedArrival
                                : currentStep === 4
                                  ? "The mechanic has arrived and is diagnosing your vehicle issue"
                                  : currentStep === 5
                                    ? "Service has been completed successfully"
                                    : "Your booking is being processed"}
                            </p>
                          </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Sl No
                                  </th>
                                  <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Item
                                  </th>
                                  <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Qty
                                  </th>
                                  <th className="px-2 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                  </th>
                                  <th className="px-2 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {bookingData.quotation.items.map((item) => (
                                  <tr key={item.slNo}>
                                    <td className="px-2 py-2 text-xs text-gray-900">{item.slNo}</td>
                                    <td className="px-2 py-2 text-xs text-gray-900">{item.name}</td>
                                    <td className="px-2 py-2 text-xs text-gray-900 text-center">{item.qty}</td>
                                    <td className="px-2 py-2 text-xs text-gray-900 text-right">
                                      {bookingData.quotation.currency} {item.price.toFixed(2)}
                                    </td>
                                    <td className="px-2 py-2 text-xs text-gray-900 text-right">
                                      {bookingData.quotation.currency} {item.total.toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-gray-50">
                                  <td colSpan={4} className="px-2 py-2 text-xs font-medium text-gray-900 text-right">
                                    Total
                                  </td>
                                  <td className="px-2 py-2 text-xs font-medium text-gray-900 text-right">
                                    {bookingData.quotation.currency} {bookingData.quotation.amount.toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {bookingData.quotation.notes && (
                          <div className="mt-3 p-2 bg-gray-50 rounded-lg text-xs text-gray-600">
                            <p className="font-medium text-gray-900 mb-1">Notes:</p>
                            <p>{bookingData.quotation.notes}</p>
                          </div>
                        )}

                        {bookingData.quotation.status === "generated" && !isPaymentComplete && (
                          <div className="mt-4">
                            <Button onClick={() => setShowQuotationModal(true)} className="w-full text-sm h-9">
                              Accept & Pay
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Quotation Modal */}
      {showQuotationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto"
          >
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
              <h3 className="font-medium text-gray-900">Service Quotation</h3>
              <button onClick={() => setShowQuotationModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Quotation Details</h4>
                    <p className="text-xs text-gray-600">Please review the service quotation before accepting.</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden mb-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Sl No
                        </th>
                        <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-2 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-2 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookingData.quotation.items.map((item) => (
                        <tr key={item.slNo}>
                          <td className="px-2 py-2 text-xs text-gray-900">{item.slNo}</td>
                          <td className="px-2 py-2 text-xs text-gray-900">{item.name}</td>
                          <td className="px-2 py-2 text-xs text-gray-900 text-center">{item.qty}</td>
                          <td className="px-2 py-2 text-xs text-gray-900 text-right">
                            {bookingData.quotation.currency} {item.price.toFixed(2)}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-900 text-right">
                            {bookingData.quotation.currency} {item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="px-2 py-2 text-xs font-medium text-gray-900 text-right">
                          Total
                        </td>
                        <td className="px-2 py-2 text-xs font-medium text-gray-900 text-right">
                          {bookingData.quotation.currency} {bookingData.quotation.amount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {bookingData.quotation.notes && (
                <div className="mb-4 p-2 bg-gray-50 rounded-lg text-xs text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">Notes:</p>
                  <p>{bookingData.quotation.notes}</p>
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                <div className="flex items-start gap-2">
                  <div className="text-blue-600 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Payment Information</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      By accepting this quotation, you agree to pay the total amount of {bookingData.quotation.currency}{" "}
                      {bookingData.quotation.amount.toFixed(2)}. Payment will be processed immediately.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAcceptAndPay} className="flex-1 text-sm h-9" disabled={isPaymentProcessing}>
                  {isPaymentProcessing ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Accept & Pay"
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-sm h-9"
                  onClick={() => setShowQuotationModal(false)}
                  disabled={isPaymentProcessing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-red-50 to-red-100/50">
              <h3 className="font-medium text-gray-900">Cancel Service</h3>
              <button onClick={() => setShowCancelModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Are you sure?</h4>
                  <p className="text-sm text-gray-600">
                    Do you really want to cancel this service request? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 mb-4">
                <div className="flex items-start gap-2">
                  <div className="text-yellow-600 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900">Cancellation Policy</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Cancellation is free if the mechanic hasn't started the journey. A cancellation fee may apply if
                      the mechanic is already en route.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCancelBooking}
                  variant="destructive"
                  className="flex-1 text-sm h-9 bg-red-600 hover:bg-red-700"
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Yes, Cancel Service"
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-sm h-9"
                  onClick={() => setShowCancelModal(false)}
                  disabled={isCancelling}
                >
                  No, Keep Booking
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
