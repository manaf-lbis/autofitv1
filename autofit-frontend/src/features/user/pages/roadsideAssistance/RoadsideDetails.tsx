// import { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import {
//   MapPin,
//   Star,
//   CheckCircle,
//   AlertCircle,
//   FileText,
//   CreditCard,
//   ArrowLeft,
//   Car,
//   // Tool,
//   Shield,
//   CheckSquare,
//   X,
//   MessageCircle,
//   Clock,
//   Calendar,
//   Info,
//   XCircle,
//   Check,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import { motion } from "framer-motion";
// import { useApproveQuoteAndPayMutation, useCancellBookingMutation, useRejectQuotationMutation, useRoadsideDetailsQuery } from "../../api/servicesApi";
// import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
// import RoadsideDetailsShimmer from "../../components/shimmer/RoadsideDetailsShimmer";

// export default function RoadsideDetails() {
//   const [activeTab, setActiveTab] = useState("details");
//   const [showQuotationModal, setShowQuotationModal] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
//   const [isPaymentComplete, setIsPaymentComplete] = useState(false);
//   const [isCancelling, setIsCancelling] = useState(false);
//   const [isCancelled, setIsCancelled] = useState(false);
//   const [isRejecting, setIsRejecting] = useState(false);
//   const [approveAndPay] = useApproveQuoteAndPayMutation()
//   const [cancelBooking] = useCancellBookingMutation()
//   const [rejectQuotation] = useRejectQuotationMutation()

//   const params = useParams();
//   const { data,isLoading } = useRoadsideDetailsQuery(params.id as string);
//   const {isReady,openRazorpay} = useRazorpayCheckout()

//   const bookingData = data?.data;

//   useEffect(() => {
//     if (bookingData?.paymentId) {
//       setIsPaymentComplete(true);
//     }
//     if (bookingData?.status === "canceled") {
//       setIsCancelled(true);
//     }
//   }, [bookingData]);

//   const handleAcceptAndPay = async () => {
//     setIsPaymentProcessing(true);
//     try {
//       const {data} = await approveAndPay({serviceId:params.id as string,quotationId:bookingData?.quotationId._id}).unwrap()
      
//       openRazorpay({orderId:data.orderId,
//         user:{name:'manf',contact:'7994414155',email:'manaf@gmail.com'},
//         onSuccess:()=>console.log('success'),      
//       })

//     } catch (error) {
//       console.log(error);
//     }
//     setIsPaymentProcessing(false);
//   };

//   const handleRejectQuotation = () => {
//     rejectQuotation({quotaionId})
//   };

//   const handleCancelBooking = () => {
//     await cancelBooking({serviceId})
  
//   };

//   const formatDateTime = (dateString: string | null) => {
//     if (!dateString) return "Not yet started";
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getStatusTitle = (status: string) => {
//     switch (status) {
//       case "assigned":
//         return "Booking Confirmed";
//       case "on_the_way":
//         return "Mechanic En Route";
//       case "analysing":
//         return "Analysing Issue";
//       case "quotation_sent":
//         return "Quotation Sent";
//       case "in_progress":
//         return "Service In Progress";
//       case "completed":
//         return "Service Completed";
//       case "canceled":
//         return "Service Cancelled";
//       default:
//         return "Processing";
//     }
//   };

//   const timeline = [
//     {
//       id: 1,
//       title: "Booking Confirmed",
//       time: bookingData?.createdAt,
//       status: "completed",
//       icon: CheckCircle,
//     },
//     {
//       id: 2,
//       title: "Mechanic Assigned",
//       time: bookingData?.startedAt,
//       status: bookingData?.status === "assigned" ? "active" : "completed",
//       icon: CheckSquare,
//     },
//     {
//       id: 3,
//       title: "Mechanic En Route",
//       time: null,
//       status: bookingData?.status === "on_the_way" ? "active" : "pending",
//       icon: Car,
//     },
//     {
//       id: 4,
//       title: "Service Started",
//       time: null,
//       status: bookingData?.status === "analysing" || bookingData?.status === "in_progress" ? "active" : "pending",
//       icon: Car,
//     },
//     {
//       id: 5,
//       title: "Service Completed",
//       time: bookingData?.endedAt,
//       status: bookingData?.status === "completed" ? "completed" : "pending",
//       icon: Shield,
//     },
//   ];

//   if(isLoading){
//     return <RoadsideDetailsShimmer />
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br mt-16 from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
//       <main className="container mx-auto px-4 py-6 relative">
//         <div className="mb-4">
//           <Link to="/booking" className="inline-flex items-center text-blue-600 hover:text-blue-800">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             <span className="text-sm">Back</span>
//           </Link>
//         </div>

//         {/* Heading Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg p-6 mb-5 border border-gray-100"
//         >
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h1>
//               <p className="text-gray-600">Your mechanic is on the way to help you.</p>
//               <div className="flex items-center gap-2 mt-2">
//                 <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-2 py-1">
//                   {getStatusTitle(bookingData?.status || "Processing")}
//                 </Badge>
//                 <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">ID: {bookingData?._id}</Badge>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="sm" className="flex items-center justify-center gap-2">
//                 <MessageCircle className="w-4 h-4" />
//                 Message
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
//                 onClick={() => setShowCancelModal(true)}
//                 disabled={isCancelled || bookingData?.status === "completed"}
//               >
//                 <XCircle className="w-4 h-4" />
//                 {isCancelled ? "Cancelled" : "Cancel"}
//               </Button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Tabs */}
//         <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 mb-4 gap-2">
//           <button
//             className={cn(
//               "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
//               activeTab === "details"
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded-t-lg"
//             )}
//             onClick={() => setActiveTab("details")}
//           >
//             Details
//           </button>
//           {bookingData?.status === "on_the_way" && (
//             <button
//               className={cn(
//                 "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
//                 activeTab === "map"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded-t-lg"
//               )}
//               onClick={() => setActiveTab("map")}
//             >
//               Track
//             </button>
//           )}
//           <button
//             className={cn(
//               "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
//               activeTab === "payment"
//                 ? "text-blue-600 border-b-2 border-blue-600"
//                 : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 rounded-t-lg"
//             )}
//             onClick={() => setActiveTab("payment")}
//           >
//             Payment
//           </button>
//         </div>

//         {/* Tab Content and Left Column */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {/* Right Column (Tab Content) - First on Mobile */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: 0.2 }}
//             className="lg:col-span-2 order-1 lg:order-2"
//           >
//             {activeTab === "details" && (
//               <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
//                 <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
//                   <h3 className="text-sm font-medium text-gray-700">Booking Summary</h3>
//                 </div>
//                 <div className="p-5">
//                   {/* Status Card */}
//                   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 mb-6">
//                     <div className="flex items-center gap-3 mb-2">
//                       <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
//                         {bookingData?.status === "completed" ? (
//                           <CheckCircle className="w-5 h-5 text-green-600" />
//                         ) : (
//                           <AlertCircle className="w-5 h-5 text-blue-600" />
//                         )}
//                       </div>
//                       <div>
//                         <h4 className="font-medium text-blue-900">{getStatusTitle(bookingData?.status || "Processing")}</h4>
//                         <p className="text-sm text-blue-700 mt-0.5">
//                           {bookingData?.status === "on_the_way"
//                             ? "Your mechanic is on the way."
//                             : bookingData?.status === "analysing"
//                             ? "The mechanic is diagnosing your vehicle issue."
//                             : bookingData?.status === "completed"
//                             ? "Service has been completed successfully."
//                             : bookingData?.status === "quotation_sent"
//                             ? "Please review the quotation."
//                             : "Your booking is being processed."}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-100">
//                       <div className="flex items-center gap-1 text-sm text-blue-700">
//                         <Clock className="w-4 h-4" />
//                         <span>Started: {formatDateTime(bookingData?.startedAt)}</span>
//                       </div>
//                       <div className="flex items-center gap-1 text-sm text-blue-700">
//                         <Calendar className="w-4 h-4" />
//                         <span>{formatDateTime(bookingData?.createdAt)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Booking Info */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                     <div className="flex items-start gap-3">
//                       <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
//                         <Info className="w-4 h-4 text-gray-500" />
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-700">Booking Details</h4>
//                         <div className="mt-2 space-y-1">
//                           <p className="text-xs flex justify-between">
//                             <span className="text-gray-500">Booking ID:</span>
//                             <span className="font-medium text-gray-900">{bookingData?._id}</span>
//                           </p>
//                           <p className="text-xs flex justify-between">
//                             <span className="text-gray-500">Service Type:</span>
//                             <span className="font-medium text-gray-900">Emergency Roadside</span>
//                           </p>
//                           <p className="text-xs flex justify-between">
//                             <span className="text-gray-500">Payment Status:</span>
//                             <span className="font-medium text-gray-900">{isPaymentComplete ? "Paid" : "Pending"}</span>
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-start gap-3">
//                       <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
//                         <Car className="w-4 h-4 text-gray-500" />
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-700">Vehicle Details</h4>
//                         <div className="mt-2 space-y-1">
//                           <p className="text-xs flex justify-between">
//                             <span className="text-gray-500">Make & Model:</span>
//                             <span className="font-medium text-gray-900">
//                               {bookingData?.vehicle.brand} {bookingData?.vehicle.modelName}
//                             </span>
//                           </p>
//                           <p className="text-xs flex justify-between">
//                             <span className="text-gray-500">Registration:</span>
//                             <span className="font-medium text-gray-900">{bookingData?.vehicle.regNo}</span>
//                           </p>
//                           <p className="text-xs flex justify-between">
//                             <span className="text-gray-500">Issue:</span>
//                             <span className="font-medium text-gray-900">{bookingData?.issue}</span>
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Timeline */}
//                   <div className="mb-6">
//                     <h4 className="text-sm font-medium text-gray-700 mb-3">Service Timeline</h4>
//                     <div className="space-y-3">
//                       {timeline.map((step) => (
//                         <div
//                           key={step.id}
//                           className={cn(
//                             "flex items-center p-3 rounded-lg border",
//                             step.status === "completed" && "bg-green-50/50 border-green-100",
//                             step.status === "active" && "bg-blue-50/50 border-blue-100",
//                             step.status === "pending" && "bg-gray-50/50 border-gray-100"
//                           )}
//                         >
//                           <div
//                             className={cn(
//                               "w-8 h-8 rounded-full flex items-center justify-center mr-3",
//                               step.status === "completed" && "bg-green-100",
//                               step.status === "active" && "bg-blue-100",
//                               step.status === "pending" && "bg-gray-100"
//                             )}
//                           >
//                             <step.icon
//                               className={cn(
//                                 "w-4 h-4",
//                                 step.status === "completed" && "text-green-600",
//                                 step.status === "active" && "text-blue-600",
//                                 step.status === "pending" && "text-gray-400"
//                               )}
//                             />
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between">
//                               <p
//                                 className={cn(
//                                   "text-sm font-medium",
//                                   step.status === "completed" && "text-green-900",
//                                   step.status === "active" && "text-blue-900",
//                                   step.status === "pending" && "text-gray-500"
//                                 )}
//                               >
//                                 {step.title}
//                               </p>
//                               <p className="text-xs text-gray-500">{formatDateTime(step.time)}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   {bookingData?.quotationId && (
//                     <Button
//                       onClick={() => setShowQuotationModal(true)}
//                       className="w-full text-sm h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//                     >
//                       <FileText className="w-4 h-4 mr-2" />
//                       View Service Quotation
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             )}

//             {activeTab === "map" && bookingData?.status === "on_the_way" && (
//               <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
//                 <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
//                   <h3 className="text-sm font-medium text-gray-700">Track Mechanic</h3>
//                 </div>
//                 <div className="p-4">
//                   <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-100 rounded-lg overflow-hidden relative">
//                     <iframe
//                       width="100%"
//                       height="100%"
//                       style={{ border: 0 }}
//                       loading="lazy"
//                       allowFullScreen
//                       src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFwQbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${bookingData?.serviceLocation?.coordinates[1]},${bookingData?.serviceLocation?.coordinates[0]}&zoom=15`}
//                     ></iframe>
//                     <motion.div
//                       initial={{ y: 10, opacity: 0 }}
//                       animate={{ y: 0, opacity: 1 }}
//                       transition={{ delay: 0.3 }}
//                       className="absolute bottom-3 left-3 bg-white rounded-lg shadow-md p-2"
//                     >
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
//                           <img
//                             src={bookingData?.mechanic?.avatar || "/placeholder.svg"}
//                             alt={bookingData?.mechanic?.name}
//                             width={32}
//                             height={32}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div>
//                           <p className="text-xs font-medium text-gray-900">{bookingData?.mechanic?.name}</p>
//                           <p className="text-[10px] text-gray-600">On the way</p>
//                         </div>
//                       </div>
//                     </motion.div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "payment" && (
//               <div className="space-y-4">
//                 <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
//                   <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
//                     <h3 className="text-sm font-medium text-gray-700">Payment Information</h3>
//                   </div>
//                   <div className="p-4">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div
//                         className={cn(
//                           "w-8 h-8 rounded-full flex items-center justify-center",
//                           isPaymentComplete ? "bg-green-100" : "bg-red-100"
//                         )}
//                       >
//                         <CreditCard
//                           className={cn("w-4 h-4", isPaymentComplete ? "text-green-600" : "text-red-600")}
//                         />
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-900">
//                           Payment {isPaymentComplete ? "Completed" : "Pending"}
//                         </h4>
//                         <p className="text-xs text-gray-600">
//                           {isPaymentComplete
//                             ? "Payment has been processed successfully."
//                             : "Payment will be processed after accepting the quotation."}
//                         </p>
//                       </div>
//                     </div>
//                     {!isPaymentComplete && bookingData?.quotationId && (
//                       <Button onClick={() => setShowQuotationModal(true)} className="w-full text-sm h-9">
//                         View & Accept Quotation
//                       </Button>
//                     )}
//                   </div>
//                 </div>

//                 {bookingData?.quotationId && (
//                   <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
//                     <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
//                       <h3 className="text-sm font-medium text-gray-700">Service Quotation</h3>
//                     </div>
//                     <div className="p-4">
//                       <div className="border rounded-lg overflow-hidden">
//                         <div className="overflow-x-auto">
//                           <table className="w-full">
//                             <thead className="bg-gray-50">
//                               <tr>
//                                 <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
//                                   Sl No
//                                 </th>
//                                 <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
//                                   Item
//                                 </th>
//                                 <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">
//                                   Qty
//                                 </th>
//                                 <th className="px-2 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
//                                   Price
//                                 </th>
//                                 <th className="px-2 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
//                                   Total
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                               {bookingData.quotationId.items.map((item:any, index:any) => (
//                                 <tr key={item._id}>
//                                   <td className="px-2 py-2 text-xs text-gray-900">{index + 1}</td>
//                                   <td className="px-2 py-2 text-xs text-gray-900">{item.name}</td>
//                                   <td className="px-2 py-2 text-xs text-gray-900 text-center">{item.quantity}</td>
//                                   <td className="px-2 py-2 text-xs text-gray-900 text-right">{item.price.toFixed(2)} INR</td>
//                                   <td className="px-2 py-2 text-xs text-gray-900 text-right">
//                                     {(item.quantity * item.price).toFixed(2)} INR
//                                   </td>
//                                 </tr>
//                               ))}
//                               <tr className="bg-gray-50">
//                                 <td colSpan={4} className="px-2 py-2 text-xs font-medium text-gray-900 text-right">
//                                   Total
//                                 </td>
//                                 <td className="px-2 py-2 text-xs font-medium text-gray-900 text-right">
//                                   {bookingData.quotationId.total.toFixed(2)} INR
//                                 </td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </motion.div>

//           {/* Left Column - Below on Mobile */}
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: 0.1 }}
//             className="lg:col-span-1 order-2 lg:order-1"
//           >
//             <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4">
//               <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
//                 <h3 className="text-sm font-medium text-gray-700">Assigned Mechanic</h3>
//               </div>
//               <div className="p-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-blue-100">
//                     <img
//                       src={bookingData?.mechanic?.avatar || "/placeholder.svg"}
//                       alt={bookingData?.mechanic?.name}
//                       width={56}
//                       height={56}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-gray-900">{bookingData?.mechanic?.name}</h4>
//                     <div className="flex items-center gap-1 text-xs text-gray-600">
//                       <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
//                       <span>4.5</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4">
//               <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
//                 <h3 className="text-sm font-medium text-gray-700">Vehicle Information</h3>
//               </div>
//               <div className="p-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-xs text-gray-600">Make & Model</span>
//                     <span className="text-xs font-medium text-gray-900">
//                       {bookingData?.vehicle?.brand} {bookingData?.vehicle?.modelName}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs text-gray-600">Registration</span>
//                     <span className="text-xs font-medium text-gray-900">{bookingData?.vehicle?.regNo}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs text-gray-600">Owner</span>
//                     <span className="text-xs font-medium text-gray-900">{bookingData?.vehicle?.owner}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
//               <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
//                 <h3 className="text-sm font-medium text-gray-700">Issue Details</h3>
//               </div>
//               <div className="p-4">
//                 <div className="space-y-2">
//                   <div>
//                     <span className="text-xs text-gray-600">Description</span>
//                     <p className="text-xs font-medium text-gray-900 mt-0.5">{bookingData?.description}</p>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs text-gray-600">Category</span>
//                     <span className="text-xs font-medium text-gray-900">{bookingData?.issue}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </main>

//       {/* Quotation Modal */}
//       {showQuotationModal && bookingData?.quotationId && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto"
//           >
//             <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
//               <h3 className="font-medium text-gray-900">Service Quotation</h3>
//               <button onClick={() => setShowQuotationModal(false)} className="text-gray-500 hover:text-gray-700">
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//             <div className="p-4">
//               <div className="mb-4">
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                     <FileText className="w-4 h-4 text-green-600" />
//                   </div>
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-900">Quotation Details</h4>
//                     <p className="text-xs text-gray-600">Review the quotation before proceeding.</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="border rounded-lg overflow-hidden mb-4">
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
//                           Sl No
//                         </th>
//                         <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
//                           Item
//                         </th>
//                         <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">
//                           Qty
//                         </th>
//                         <th className="px-2 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
//                           Price
//                         </th>
//                         <th className="px-2 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
//                           Total
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {bookingData.quotationId.items.map((item:any, index:any) => (
//                         <tr key={item._id}>
//                           <td className="px-2 py-2 text-xs text-gray-900">{index + 1}</td>
//                           <td className="px-2 py-2 text-xs text-gray-900">{item.name}</td>
//                           <td className="px-2 py-2 text-xs text-gray-900 text-center">{item.quantity}</td>
//                           <td className="px-2 py-2 text-xs text-gray-900 text-right">{item.price.toFixed(2)} INR</td>
//                           <td className="px-2 py-2 text-xs text-gray-900 text-right">
//                             {(item.quantity * item.price).toFixed(2)} INR
//                           </td>
//                         </tr>
//                       ))}
//                       <tr className="bg-gray-50">
//                         <td colSpan={4} className="px-2 py-2 text-xs font-medium text-gray-900 text-right">
//                           Total
//                         </td>
//                         <td className="px-2 py-2 text-xs font-medium text-gray-900 text-right">
//                           {bookingData.quotationId.total.toFixed(2)} INR
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <Button
//                   onClick={handleAcceptAndPay}
//                   className="flex-1 text-sm h-9"
//                   disabled={isPaymentProcessing || isRejecting}
//                 >
//                   {isPaymentProcessing ? (
//                     <>
//                       <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Processing...
//                     </>
//                   ) : (
//                     "Accept & Pay"
//                   )}
//                 </Button>
//                 <Button
//                   onClick={handleRejectQuotation}
//                   variant="outline"
//                   className="flex-1 text-sm h-9 text-red-600 border-red-200 hover:bg-red-50"
//                   disabled={isRejecting || isPaymentProcessing}
//                 >
//                   {isRejecting ? (
//                     <>
//                       <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Rejecting...
//                     </>
//                   ) : (
//                     "Reject Quotation"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Cancellation Modal */}
//       {showCancelModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white rounded-xl shadow-2xl max-w-md w-full"
//           >
//             <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-red-50 to-red-100/50">
//               <h3 className="font-medium text-gray-900">Cancel Service</h3>
//               <button onClick={() => setShowCancelModal(false)} className="text-gray-500 hover:text-gray-700">
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//             <div className="p-4">
//               <div className="mb-4 flex items-center gap-3">
//                 <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
//                   <XCircle className="w-5 h-5 text-red-600" />
//                 </div>
//                 <div>
//                   <h4 className="text-lg font-medium text-gray-900">Are you sure?</h4>
//                   <p className="text-sm text-gray-600">
//                     Cancelling this service request cannot be undone.
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <Button
//                   onClick={handleCancelBooking}
//                   variant="destructive"
//                   className="flex-1 text-sm h-9 bg-red-600 hover:bg-red-700"
//                   disabled={isCancelling}
//                 >
//                   {isCancelling ? (
//                     <>
//                       <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                       Processing...
//                     </>
//                   ) : (
//                     "Yes, Cancel Service"
//                   )}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="flex-1 text-sm h-9"
//                   onClick={() => setShowCancelModal(false)}
//                   disabled={isCancelling}
//                 >
//                   No, Keep Booking
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, CheckSquare, Car, Shield } from "lucide-react";
import {
  useApproveQuoteAndPayMutation,
  useCancellBookingMutation,
  useRejectQuotationMutation,
  useRoadsideDetailsQuery,
} from "../../api/servicesApi";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import RoadsideDetailsShimmer from "../../components/shimmer/RoadsideDetailsShimmer";
import { HeadingSection } from "../../components/roadsideAssistance/HeadingSection";
import { TabsSection } from "../../components/roadsideAssistance/TabsSection";
import { DetailsTabContent } from "../../components/roadsideAssistance/DetailsTabContent";
import { MapTabContent } from "../../components/roadsideAssistance/MapTabContent";
import { PaymentTabContent } from "../../components/roadsideAssistance/PaymentTabContent";
import { LeftColumn } from "../../components/roadsideAssistance/LeftColumn";
import { QuotationModal } from "../../components/roadsideAssistance/QuotationModal";
import { CancellationModal } from "../../components/roadsideAssistance/CancellationModal";
import { motion } from "framer-motion";

export default function RoadsideDetails() {
  const [activeTab, setActiveTab] = useState("details");
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const [approveAndPay] = useApproveQuoteAndPayMutation();
  const [cancelBooking] = useCancellBookingMutation();
  const [rejectQuotation] = useRejectQuotationMutation();

  const params = useParams();
  const { data, isLoading } = useRoadsideDetailsQuery(params.id as string);
  const { isReady, openRazorpay } = useRazorpayCheckout();

  const bookingData = data?.data;

  useEffect(() => {
    if (bookingData?.paymentId) setIsPaymentComplete(true);
    if (bookingData?.status === "canceled") setIsCancelled(true);
  }, [bookingData]);

  const handleAcceptAndPay = async () => {
    setIsPaymentProcessing(true);
    try {
      const { data } = await approveAndPay({
        serviceId: params.id as string,
        quotationId: bookingData?.quotationId._id,
      }).unwrap();

      openRazorpay({
        orderId: data.orderId,
        user: { name: "manf", contact: "7994414155", email: "manaf@gmail.com" },
        onSuccess: () => {
          console.log("Payment successful");
          setIsPaymentComplete(true);
        },
      });
    } catch (error) {
      console.log("Payment error:", error);
    }
    setIsPaymentProcessing(false);
  };

  const handleRejectQuotation = async () => {
    setIsRejecting(true);
    try {
      await rejectQuotation({ quotationId: bookingData?.quotationId._id });
      setIsCancelled(true);
      setShowQuotationModal(false);
    } catch (error) {
      console.log("Rejection error:", error);
    }
    setIsRejecting(false);
  };

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      await cancelBooking({ serviceId: params.id as string });
      setIsCancelled(true);
    } catch (error) {
      console.log("Cancellation error:", error);
    }
    setIsCancelling(false);
    setShowCancelModal(false);
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Not yet started";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case "assigned": return "Booking Confirmed";
      case "on_the_way": return "Mechanic En Route";
      case "analysing": return "Analysing Issue";
      case "quotation_sent": return "Quotation Sent";
      case "in_progress": return "Service In Progress";
      case "completed": return "Service Completed";
      case "canceled": return "Service Cancelled";
      default: return "Processing";
    }
  };

  const timeline = [
    { id: 1, title: "Booking Confirmed", time: bookingData?.createdAt, status: "completed", icon: CheckCircle },
    {
      id: 2,
      title: "Mechanic Assigned",
      time: bookingData?.startedAt,
      status: bookingData?.status === "assigned" ? "active" : "completed",
      icon: CheckSquare,
    },
    {
      id: 3,
      title: "Mechanic En Route",
      time: null,
      status: bookingData?.status === "on_the_way" ? "active" : "pending",
      icon: Car,
    },
    {
      id: 4,
      title: "Service Started",
      time: null,
      status: bookingData?.status === "analysing" || bookingData?.status === "in_progress" ? "active" : "pending",
      icon: Car,
    },
    {
      id: 5,
      title: "Service Completed",
      time: bookingData?.endedAt,
      status: bookingData?.status === "completed" ? "completed" : "pending",
      icon: Shield,
    },
  ];

  if (isLoading) return <RoadsideDetailsShimmer />;

  return (
    <div className="min-h-screen bg-gradient-to-br mt-16 from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      <main className="container mx-auto px-4 py-6 relative">
        <div className="mb-4">
          <Link to="/booking" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm">Back</span>
          </Link>
        </div>

        <HeadingSection
          title="Booking Confirmed!"
          description="Your mechanic is on the way to help you."
          status={getStatusTitle(bookingData?.status || "Processing")}
          bookingId={bookingData?._id || ""}
          onMessageClick={() => console.log("Message clicked")}
          onCancelClick={() => setShowCancelModal(true)}
          isCancelled={isCancelled}
          isCompleted={bookingData?.status === "completed"}
        />

        <TabsSection
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showTrackTab={bookingData?.status === "on_the_way"}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 order-1 lg:order-2"
          >
            {activeTab === "details" && (
              <DetailsTabContent
                status={bookingData?.status || ""}
                startedAt={bookingData?.startedAt}
                createdAt={bookingData?.createdAt || ""}
                bookingId={bookingData?._id || ""}
                vehicle={bookingData?.vehicle || { brand: "", modelName: "", regNo: "" }}
                issue={bookingData?.issue || ""}
                timeline={timeline}
                onViewQuotation={() => setShowQuotationModal(true)}
                formatDateTime={formatDateTime}
                getStatusTitle={getStatusTitle}
              />
            )}
            {activeTab === "map" && bookingData?.status === "on_the_way" && (
              <MapTabContent
                serviceLocation={bookingData?.serviceLocation || { coordinates: [0, 0] }}
                mechanic={bookingData?.mechanic || { name: "", avatar: "" }}
              />
            )}
            {activeTab === "payment" && (
              <PaymentTabContent
                isPaymentComplete={isPaymentComplete}
                quotationId={bookingData?.quotationId}
                onViewQuotation={() => setShowQuotationModal(true)}
              />
            )}
          </motion.div>

          <LeftColumn
            mechanic={bookingData?.mechanic || { name: "", avatar: "" }}
            vehicle={bookingData?.vehicle || { brand: "", modelName: "", regNo: "", owner: "" }}
            issue={bookingData?.issue || ""}
            description={bookingData?.description || ""}
          />
        </div>
      </main>

      {showQuotationModal && bookingData?.quotationId && (
        <QuotationModal
          quotation={bookingData.quotationId}
          onClose={() => setShowQuotationModal(false)}
          onAccept={handleAcceptAndPay}
          onReject={handleRejectQuotation}
          isProcessing={isPaymentProcessing}
          isRejecting={isRejecting}
        />
      )}

      {showCancelModal && (
        <CancellationModal
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelBooking}
          isProcessing={isCancelling}
        />
      )}
    </div>
  );
}