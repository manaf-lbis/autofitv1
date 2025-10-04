// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { useGenerateInvoiceMutation, useGenerateReportMutation, usePretripDetailsQuery } from "@/services/userServices/pretripUserApi"
// import {
//   Car,
//   CreditCard,
//   ArrowLeft,
//   Calendar,
//   RefreshCw,
//   FileText,
//   Download,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   ReceiptText,
// } from "lucide-react"
// import { useNavigate, useParams } from "react-router-dom"
// import toast from "react-hot-toast"
// import { RatingButton } from "@/components/shared/rating/RatingButton"
// import { ServiceType } from "@/types/user"

// const formatTime = (dateString: string) => {
//   return new Date(dateString).toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   })
// }

// const getConditionIcon = (condition: string) => {
//   switch (condition) {
//     case "excellent":
//       return <CheckCircle className="h-4 w-4 text-green-600" />
//     case "good":
//       return <AlertTriangle className="h-4 w-4 text-yellow-600" />
//     case "average":
//       return <XCircle className="h-4 w-4 text-red-600" />
//     default:
//       return <AlertTriangle className="h-4 w-4 text-gray-600" />
//   }
// }

// const calculateSafetyScore = (reportItems: any[]) => {
//   if (!reportItems.length) return 0;
//   const conditionPoints: { [key: string]: number } = { excellent: 5, good: 3, average: 1 };
//   const points = reportItems.reduce((sum, item) => sum + (conditionPoints[item.condition] || 0), 0);
//   return Math.round((points / (reportItems.length * 5)) * 100);
// }

// const getOverallStatus = (score: number) => {
//   if (score >= 90) return "Excellent";
//   if (score >= 70) return "Good";
//   return "Needs Attention";
// }

// export default function PretripDetails() {
//   const { id } = useParams();
//   const { data, refetch, isLoading: isRefreshing } = usePretripDetailsQuery({ id: id! }, { skip: !id, refetchOnMountOrArgChange: true, refetchOnReconnect: true, refetchOnFocus: true });
//   const [generateInvoice, { isLoading }] = useGenerateInvoiceMutation();
//   const [generateReport, { isLoading: isLoadingReport }] = useGenerateReportMutation();
//   const navigate = useNavigate();

//   const safetyScore = calculateSafetyScore(data?.serviceReportId?.reportItems || []);
//   const overallStatus = getOverallStatus(safetyScore);
//   const recommendations = (data?.serviceReportId?.reportItems || []).filter((item: any) => item.needsAction).map((item: any) => `Check ${item.feature}`);

//   const handleDownloadReceipt = async () => {
//     try {
//       await generateInvoice({ serviceId: data?._id }).unwrap();
//     } catch (error: any) {
//       toast.error(error.data.message || "Failed to download receipt");
//     }
//   }

//   const handleDownloadReport = async () => {
//     try {
//       await generateReport({ serviceId: data?._id }).unwrap();
//     } catch (error: any) {
//       toast.error(error.data.message || "Failed to download receipt");
//     }
//   }

//   return (
//     <div className="min-h-screen md:mb-0 mb-20">
//       {/* Mobile Layout */}
//       <div className="block md:hidden bg-gray-50">
//         {/* Mobile Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="focus:outline-none -ml-2"
//                 onClick={() => navigate(-1)}
//                 aria-label="Go back"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//               </Button>
//               <h1 className="text-lg font-semibold text-gray-900">Pretrip Analysis</h1>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="text-xs px-2"
//                 aria-label="Refresh data"
//                 onClick={() => refetch()}
//               >
//                 <RefreshCw className="h-3 w-3" />
//               </Button>
//               <Badge className="bg-green-500 text-white text-xs">{data?.status}</Badge>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Content */}
//         <div className="p-4 space-y-4">
//           {/* Vehicle Info */}
//           <div className="bg-white rounded-lg border border-gray-100 p-4">
//             <div className="flex items-center mb-3">
//               <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
//                 <Car className="h-4 w-4 text-green-600" />
//               </div>
//               <h2 className="text-sm font-medium text-gray-900">Vehicle Info</h2>
//             </div>
//             <div className="space-y-2">
//               <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Registration</span>
//                 <span className="font-medium text-gray-900 text-sm">{data?.vehicleId?.regNo}</span>
//               </div>
//               <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Brand</span>
//                 <span className="font-medium text-gray-900 text-sm">{data?.vehicleId?.brand}</span>
//               </div>
//               <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Model</span>
//                 <span className="font-medium text-gray-900 text-sm">{data?.vehicleId?.modelName}</span>
//               </div>
//               <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Fuel Type</span>
//                 <span className="font-medium text-gray-900 text-sm">{data?.vehicleId?.fuelType}</span>
//               </div>
//               <div className="flex justify-between items-center py-2">
//                 <span className="text-sm text-gray-600">Owner</span>
//                 <span className="font-medium text-gray-900 text-sm">{data?.vehicleId?.owner}</span>
//               </div>
//             </div>
//           </div>

//           {/* Service Plan & Schedule */}
//           <div className="bg-white rounded-lg border border-gray-100 p-4">
//             <div className="flex items-center mb-3">
//               <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
//                 <Calendar className="h-4 w-4 text-purple-600" />
//               </div>
//               <h2 className="text-sm font-medium text-gray-900">Service Plan & Schedule</h2>
//             </div>
//             <div className="space-y-2">

//               <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Service Id</span>
//                 <span className="font-medium text-gray-900 text-sm">{data?.bookingId}</span>
//               </div>

//               <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Plan</span>
//                 <span className="font-medium text-gray-900 text-sm">{data?.serviceReportId?.servicePlan?.name}</span>
//               </div>
//               <div className="flex justify-between items-start py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Schedule</span>
//                 <span className="font-medium text-gray-900 text-sm text-right">{`${formatTime(data?.schedule?.start)} - ${formatTime(data?.schedule?.end)}`}</span>
//               </div>
//               <div className="flex justify-between items-center py-2">
//                 <span className="text-sm text-gray-600">Price</span>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-gray-500 line-through text-sm">₹{data?.serviceReportId?.servicePlan?.originalPrice}</span>
//                   <span className="font-medium text-gray-900 text-sm">₹{data?.serviceReportId?.servicePlan?.price}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Payment Info */}
//           <div className="bg-white rounded-lg border border-gray-100 p-4">
//             <div className="flex items-center mb-3">
//               <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
//                 <CreditCard className="h-4 w-4 text-green-600" />
//               </div>
//               <h2 className="text-sm font-medium text-gray-900">Payment Info</h2>
//             </div>
//             <div className="space-y-2">
//               <div className="flex justify-between items-start py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Payment ID</span>
//                 <span className="font-medium text-gray-900 text-sm text-right break-all">{data?.payment?.paymentId?.paymentId}</span>
//               </div>
//               <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Mode</span>
//                 <span className="font-medium text-gray-900 capitalize text-sm">{data?.payment?.paymentId?.method}</span>
//               </div>
//               <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Status</span>
//                 <span className="font-medium text-gray-900 capitalize text-sm">{data?.payment?.status}</span>
//               </div>
//               <div className="flex justify-between items-center py-2">
//                 <span className="text-sm text-gray-600">Amount</span>
//                 <span className="font-medium text-gray-900 text-sm">₹{data?.payment?.paymentId?.amount}</span>
//               </div>
//             </div>
//           </div>

//           {/* Overall Assessment */}
//           <div className="bg-white rounded-lg border border-gray-100 p-4">
//             <div className="flex items-center mb-3">
//               <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
//                 <FileText className="h-4 w-4 text-indigo-600" />
//               </div>
//               <h2 className="text-sm font-medium text-gray-900">Overall Assessment</h2>
//             </div>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Safety Score</span>
//                 <div className="flex items-center gap-2">
//                   <div className="w-16 h-2 bg-gray-200 rounded-full">
//                     <div
//                       className="h-2 bg-yellow-500 rounded-full"
//                       style={{ width: `${safetyScore}%` }}
//                     />
//                   </div>
//                   <span className="font-medium text-gray-900 text-sm">{safetyScore}%</span>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Status</span>
//                 <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
//                   {overallStatus}
//                 </Badge>
//               </div>
//               <div className="py-2">
//                 <span className="text-sm text-gray-600 block mb-2">Mechanic Notes</span>
//                 <p className="text-sm text-gray-900">{data?.serviceReportId?.mechanicNotes}</p>
//               </div>
//               {recommendations.length > 0 && (
//                 <div className="py-2">
//                   <span className="text-sm text-gray-600 block mb-2">Recommendations</span>
//                   <ul className="space-y-1">
//                     {recommendations.map((rec: any, index: any) => (
//                       <li key={index} className="text-sm text-gray-900 flex items-start gap-2">
//                         <span className="text-yellow-600 mt-1">•</span>
//                         {rec}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Service Report */}
//           <div className="bg-white rounded-lg border border-gray-100 p-4">
//             <div className="flex items-center mb-3">
//               <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
//                 <FileText className="h-4 w-4 text-blue-600" />
//               </div>
//               <h2 className="text-sm font-medium text-gray-900">Service Report</h2>
//             </div>
//             <div className="space-y-3">
//               {(data?.serviceReportId?.reportItems || []).map((item: any, index: number) => (
//                 <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex items-center gap-2 flex-1 min-w-0">
//                       {getConditionIcon(item.condition)}
//                       <span className="font-medium text-gray-900 text-sm truncate">{item.feature}</span>
//                     </div>
//                     <div className="flex flex-col items-end gap-1 ml-2">
//                       <Badge
//                         variant={item.condition === "excellent" ? "secondary" : "outline"}
//                         className={`text-xs ${item.condition === "excellent"
//                           ? "bg-green-100 text-green-800"
//                           : item.condition === "good"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : "bg-red-100 text-red-800"
//                           }`}
//                       >
//                         {item.condition}
//                       </Badge>
//                       {item.needsAction && (
//                         <Badge variant="destructive" className="text-xs">
//                           Action Required
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                   {item.remarks && (
//                     <div className="mt-2 pt-2 border-t border-gray-200">
//                       <span className="text-xs text-gray-500 block mb-1">Remarks:</span>
//                       <p className="text-sm text-gray-700">{item.remarks}</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="space-y-2 pb-4">
//             <div className="flex gap-2">
//               <Button disabled={isLoadingReport} onClick={handleDownloadReport} className="w-full bg-blue-600 hover:bg-blue-700 h-10 focus:outline-none">
//                 <Download className="h-4 w-4 mr-2" />
//                 Download Report
//               </Button>
//               {data?.status === "vehicle_returned" && <RatingButton
//                 displayStyle='single-star'
//                 size="sm"
//                 serviceId={data?._id}
//                 serviceType={ServiceType.PRETRIP}
//                 serviceName="Pretrip Checkup"
//                 hasRated={data?.ratingId?._id ? true : false}
//                 userRating={data?.ratingId?.rating}
//                 userReview={data?.ratingId?.review}
//                 refetch={refetch}

//               />}
//             </div>

//             <Button disabled={isLoading} onClick={handleDownloadReceipt} variant="outline" className="w-full bg-transparent h-10 focus:outline-none">
//               <ReceiptText className="h-4 w-4 mr-2" />
//               Download Receipt
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Desktop Layout - Unchanged */}
//       <div className="hidden md:block p-4 max-w-7xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-3" onClick={() => navigate(-1)}>
//             <Button variant="ghost" size="icon" className="focus:outline-none" aria-label="Go back">
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//             <h1 className="text-2xl font-semibold text-gray-900">Pretrip Analysis</h1>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               className="flex items-center space-x-1 bg-transparent"
//               aria-label="Refresh data"
//               onClick={() => refetch()}
//             >
//               <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
//               <span>Refresh</span>
//             </Button>
//             <Badge className="bg-green-500 text-white">{data?.status}</Badge>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
//           <Card className="shadow-sm border-0 bg-white">
//             <CardHeader className="pb-3">
//               <CardTitle className="flex items-center text-sm font-medium text-gray-900">
//                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
//                   <Car className="h-4 w-4 text-green-600" />
//                 </div>
//                 Vehicle Info
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0">
//               <div className="space-y-2">
//                 <div className="flex justify-between py-2 border-b border-gray-100">
//                   <span className="text-sm text-gray-600">Registration</span>
//                   <span className="font-medium text-gray-900">{data?.vehicleId?.regNo}</span>
//                 </div>
//                 <div className="flex justify-between py-2 border-b border-gray-100">
//                   <span className="text-sm text-gray-600">Brand</span>
//                   <span className="font-medium text-gray-900">{data?.vehicleId?.brand}</span>
//                 </div>
//                 <div className="flex justify-between py-2 border-b border-gray-100">
//                   <span className="text-sm text-gray-600">Model</span>
//                   <span className="font-medium text-gray-900">{data?.vehicleId?.modelName}</span>
//                 </div>
//                 <div className="flex justify-between py-2 border-b border-gray-100">
//                   <span className="text-sm text-gray-600">Fuel Type</span>
//                   <span className="font-medium text-gray-900">{data?.vehicleId?.fuelType}</span>
//                 </div>
//                 <div className="flex justify-between py-2">
//                   <span className="text-sm text-gray-600">Owner</span>
//                   <span className="font-medium text-gray-900">{data?.vehicleId?.owner}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="shadow-sm border-0 bg-white">
//             <CardHeader className="pb-3">
//               <CardTitle className="flex items-center text-sm font-medium text-gray-900">
//                 <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
//                   <Calendar className="h-4 w-4 text-purple-600" />
//                 </div>
//                 Service Plan & Schedule
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="pt-0">
//               <div className="space-y-2">
//                 <div className="flex justify-between py-2 border-b border-gray-100">
//                   <span className="text-sm text-gray-600">Serivice Id </span>
//                   <span className="font-medium text-gray-900">{data?.bookingId}</span>
//                 </div>
//                 <div className="flex justify-between py-2 border-b border-gray-100">
//                   <span className="text-sm text-gray-600">Plan</span>
//                   <span className="font-medium text-gray-900">{data?.serviceReportId?.servicePlan?.name}</span>
//                 </div>
//                 <div className="flex justify-between py-2 border-b border-gray-100">
//                   <span className="text-sm text-gray-600">Schedule</span>
//                   <span className="font-medium text-gray-900">{`${formatTime(data?.schedule?.start)} - ${formatTime(data?.schedule?.end)}`}</span>
//                 </div>
//                 <div className="flex justify-between py-2">
//                   <span className="text-sm text-gray-600">Price</span>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-gray-500 line-through">₹{data?.serviceReportId?.servicePlan?.originalPrice}</span>
//                     <span className="font-medium text-gray-900">₹{data?.serviceReportId?.servicePlan?.price}</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <Card className="shadow-sm border-0 bg-white mb-6">
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center text-sm font-medium text-gray-900">
//               <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
//                 <CreditCard className="h-4 w-4 text-green-600" />
//               </div>
//               Payment Info
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-0">
//             <div className="space-y-2">
//               <div className="flex justify-between py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Payment ID</span>
//                 <span className="font-medium text-gray-900">{data?.payment?.paymentId?.paymentId}</span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Mode</span>
//                 <span className="font-medium text-gray-900 capitalize">{data?.payment?.paymentId?.method}</span>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Status</span>
//                 <span className="font-medium text-gray-900 capitalize">{data?.payment?.status}</span>
//               </div>
//               <div className="flex justify-between py-2">
//                 <span className="text-sm text-gray-600">Amount</span>
//                 <span className="font-medium text-gray-900">₹{data?.payment?.paymentId?.amount}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border-0 bg-white mb-6">
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center text-sm font-medium text-gray-900">
//               <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
//                 <FileText className="h-4 w-4 text-indigo-600" />
//               </div>
//               Overall Assessment
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-0">
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Safety Score</span>
//                 <div className="flex items-center gap-2">
//                   <div className="w-20 h-2 bg-gray-200 rounded-full">
//                     <div
//                       className="h-2 bg-yellow-500 rounded-full"
//                       style={{ width: `${safetyScore}%` }}
//                     />
//                   </div>
//                   <span className="font-medium text-gray-900">{safetyScore}%</span>
//                 </div>
//               </div>
//               <div className="flex justify-between py-2 border-b border-gray-100">
//                 <span className="text-sm text-gray-600">Status</span>
//                 <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
//                   {overallStatus}
//                 </Badge>
//               </div>
//               <div className="py-2">
//                 <span className="text-sm text-gray-600 block mb-2">Mechanic Notes</span>
//                 <p className="text-sm text-gray-900">{data?.serviceReportId?.mechanicNotes}</p>
//               </div>
//               <div className="py-2">
//                 <span className="text-sm text-gray-600 block mb-2">Recommendations</span>
//                 <ul className="space-y-1">
//                   {recommendations.map((rec: any, index: any) => (
//                     <li key={index} className="text-sm text-gray-900 flex items-start gap-2">
//                       <span className="text-yellow-600 mt-1">•</span>
//                       {rec}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border-0 bg-white mb-6">
//           <CardHeader className="pb-3">
//             <CardTitle className="flex items-center text-sm font-medium text-gray-900">
//               <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
//                 <FileText className="h-4 w-4 text-blue-600" />
//               </div>
//               Service Report
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-0">
//             <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
//               {(data?.serviceReportId?.reportItems || []).map((item: any, index: number) => (
//                 <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-3">
//                       {getConditionIcon(item.condition)}
//                       <span className="font-medium text-gray-900">{item.feature}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Badge
//                         variant={item.condition === "excellent" ? "secondary" : "outline"}
//                         className={
//                           item.condition === "excellent"
//                             ? "bg-green-100 text-green-800"
//                             : item.condition === "good"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-red-100 text-red-800"
//                         }
//                       >
//                         {item.condition}
//                       </Badge>
//                       {item.needsAction && (
//                         <Badge variant="destructive" className="text-xs">
//                           Action Required
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                   {item.remarks && (
//                     <div className="mt-2 pt-2 border-t border-gray-200">
//                       <span className="text-xs text-gray-500 block mb-1">Remarks:</span>
//                       <p className="text-sm text-gray-700">{item.remarks}</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         <div className="flex justify-end space-x-3">
//           {data?.status === "vehicle_returned" && <RatingButton
//             displayStyle='stars'
//             size="sm"
//             serviceId={data?._id}
//             serviceType={ServiceType.PRETRIP}
//             serviceName="Pretrip Checkup"
//             hasRated={data?.ratingId?._id ? true : false}
//             userRating={data?.ratingId?.rating}
//             userReview={data?.ratingId?.review}
//             refetch={refetch}

//           />}

//           <Button disabled={isLoadingReport} onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700 h-9 focus:outline-none">
//             <Download className="h-4 w-4 mr-2" />
//             Download Report
//           </Button>
//           <Button disabled={isLoading} onClick={handleDownloadReceipt} variant="outline" className="bg-transparent h-9 focus:outline-none">
//             <ReceiptText className="h-4 w-4 mr-2" />
//             Download Receipt
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }



















import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGenerateInvoiceMutation, useGenerateReportMutation, usePretripDetailsQuery } from "@/services/userServices/pretripUserApi"
import {
  Car,
  CreditCard,
  ArrowLeft,
  Calendar,
  RefreshCw,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ReceiptText,
  Clock,
  AlertCircle,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { RatingButton } from "@/components/shared/rating/RatingButton"
import { ServiceType } from "@/types/user"

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

const getConditionIcon = (condition: string) => {
  switch (condition) {
    case "excellent":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "good":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "average":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-600" />
  }
}

const calculateSafetyScore = (reportItems: any[]) => {
  if (!reportItems.length) return 0;
  const conditionPoints: { [key: string]: number } = { excellent: 5, good: 3, average: 1 };
  const points = reportItems.reduce((sum, item) => sum + (conditionPoints[item.condition] || 0), 0);
  return Math.round((points / (reportItems.length * 5)) * 100);
}

const getOverallStatus = (score: number) => {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  return "Needs Attention";
}

export default function PretripDetails() {
  const { id } = useParams();
  const { data, refetch, isLoading: isRefreshing } = usePretripDetailsQuery({ id: id! }, { skip: !id, refetchOnMountOrArgChange: true, refetchOnReconnect: true, refetchOnFocus: true });
  const [generateInvoice, { isLoading }] = useGenerateInvoiceMutation();
  const [generateReport, { isLoading: isLoadingReport }] = useGenerateReportMutation();
  const navigate = useNavigate();

  const safetyScore = calculateSafetyScore(data?.serviceReportId?.reportItems || []);
  const overallStatus = getOverallStatus(safetyScore);
  const recommendations = (data?.serviceReportId?.reportItems || []).filter((item: any) => item.needsAction).map((item: any) => `Check ${item.feature}`);

  // Check if payment is successful
  const isPaymentSuccessful = data?.payment?.status === "paid";
  const isPaymentPending = data?.payment?.status === "pending";
  const isPaymentFailed = data?.payment?.status === "failed";
  const isPaymentInitiated = data?.payment?.status === "initiated";

  const isVehicleReturned = data?.status === "vehicle_returned" || data?.status === "completed";
  
  const shouldShowReports = isPaymentSuccessful && isVehicleReturned;

  const getDisplayStatus = () => {
    if (isPaymentInitiated) return "Payment Initiated";
    if (isPaymentPending) return "Payment Pending";
    if (isPaymentFailed) return "Payment Failed";
    
    const statusMap: { [key: string]: string } = {
      'booked': 'Booked',
      'analysing': 'Analysing',
      'report_created': 'Report Created',
      'vehicle_returned': 'Vehicle Returned',
      'cancelled': 'Cancelled',
      'completed': 'Completed'
    };
    
    return statusMap[data?.status] || data?.status;
  };

  const getStatusBadgeClass = () => {
    if (isPaymentInitiated) return "bg-orange-500 text-white";
    if (isPaymentPending) return "bg-yellow-500 text-white";
    if (isPaymentFailed) return "bg-red-500 text-white";
    
    // Status-based colors
    const statusColors: { [key: string]: string } = {
      'booked': 'bg-blue-500 text-white',
      'analysing': 'bg-purple-500 text-white',
      'report_created': 'bg-indigo-500 text-white',
      'vehicle_returned': 'bg-green-500 text-white',
      'cancelled': 'bg-red-500 text-white',
      'completed': 'bg-green-600 text-white'
    };
    
    return statusColors[data?.status] || "bg-gray-500 text-white";
  };

  const handleDownloadReceipt = async () => {
    try {
      await generateInvoice({ serviceId: data?._id }).unwrap();
    } catch (error: any) {
      toast.error(error.data.message || "Failed to download receipt");
    }
  }

  const handleDownloadReport = async () => {
    try {
      await generateReport({ serviceId: data?._id }).unwrap();
    } catch (error: any) {
      toast.error(error.data.message || "Failed to download report");
    }
  }

  const handleRetryPayment = () => {
    navigate("/pretrip-checkup/plans");
  }

  return (
    <div className="min-h-screen md:mb-0 mb-20">
      {/* Mobile Layout */}
      <div className="block md:hidden bg-gray-50">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="focus:outline-none -ml-2"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">Pretrip Analysis</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs px-2"
                aria-label="Refresh data"
                onClick={() => refetch()}
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
              <Badge className={getStatusBadgeClass()}>{getDisplayStatus()}</Badge>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-4">
          {/* Payment Status Alert */}
          {(isPaymentInitiated || isPaymentPending || isPaymentFailed) && (
            <div className={`rounded-lg border p-4 ${
              isPaymentInitiated ? 'bg-orange-50 border-orange-200' :
              isPaymentPending ? 'bg-yellow-50 border-yellow-200' : 
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {isPaymentInitiated ? (
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                ) : isPaymentPending ? (
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm mb-1 ${
                    isPaymentInitiated ? 'text-orange-900' :
                    isPaymentPending ? 'text-yellow-900' : 
                    'text-red-900'
                  }`}>
                    {isPaymentInitiated ? 'Payment Not Completed' : isPaymentPending ? 'Payment Pending' : 'Payment Failed'}
                  </h3>
                  <p className={`text-sm ${
                    isPaymentInitiated ? 'text-orange-800' :
                    isPaymentPending ? 'text-yellow-800' : 
                    'text-red-800'
                  }`}>
                    {isPaymentInitiated 
                      ? 'Your payment was initiated but not completed. Please create a new booking to try again.'
                      : isPaymentPending 
                        ? 'Your payment is being processed. Please wait or refresh to check status.'
                        : 'Your payment was unsuccessful. Please create a new booking to try again.'}
                  </p>
                  {(isPaymentInitiated || isPaymentFailed) && (
                    <Button 
                      onClick={handleRetryPayment}
                      size="sm"
                      className={`mt-3 h-8 ${
                        isPaymentInitiated 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white`}
                    >
                      Create New Booking
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Vehicle Info */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Car className="h-4 w-4 text-green-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Vehicle Information</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Registration</span>
                <span className="font-semibold text-gray-900 text-sm">{data?.vehicleId?.regNo}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Brand</span>
                <span className="font-medium text-gray-900 text-sm">{data?.vehicleId?.brand}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Model</span>
                <span className="font-medium text-gray-900 text-sm">{data?.vehicleId?.modelName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Fuel Type</span>
                <span className="font-medium text-gray-900 text-sm">{data?.vehicleId?.fuelType}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Owner</span>
                <span className="font-medium text-gray-900 text-sm">{data?.vehicleId?.owner}</span>
              </div>
            </div>
          </div>

          {/* Service Plan & Schedule */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Service Details</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Service ID</span>
                <span className="font-medium text-gray-900 text-sm">{data?.bookingId}</span>
              </div>
              {data?.serviceReportId?.servicePlan?.name && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900 text-sm">{data?.serviceReportId?.servicePlan?.name}</span>
                </div>
              )}
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Schedule</span>
                <span className="font-medium text-gray-900 text-sm text-right">{`${formatTime(data?.schedule?.start)} - ${formatTime(data?.schedule?.end)}`}</span>
              </div>
              {data?.serviceReportId?.servicePlan?.price && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Price</span>
                  <div className="flex items-center space-x-2">
                    {data?.serviceReportId?.servicePlan?.originalPrice && (
                      <span className="text-gray-500 line-through text-sm">₹{data?.serviceReportId?.servicePlan?.originalPrice}</span>
                    )}
                    <span className="font-semibold text-gray-900 text-sm">₹{data?.serviceReportId?.servicePlan?.price}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Payment Information</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Payment ID</span>
                <span className="font-medium text-gray-900 text-sm text-right break-all">{data?.payment?.paymentId?.paymentId}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Method</span>
                <span className="font-medium text-gray-900 capitalize text-sm">{data?.payment?.paymentId?.method}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Status</span>
                <Badge 
                  className={`text-xs ${
                    isPaymentSuccessful ? 'bg-green-100 text-green-800' : 
                    isPaymentInitiated ? 'bg-orange-100 text-orange-800' :
                    isPaymentPending ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {data?.payment?.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="font-semibold text-gray-900 text-sm">₹{data?.payment?.paymentId?.amount}</span>
              </div>
            </div>
          </div>

          {/* Show report sections only if payment is successful AND vehicle is returned */}
          {shouldShowReports && (
            <>
              {/* Overall Assessment */}
              <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">Overall Assessment</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Safety Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all"
                          style={{ width: `${safetyScore}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{safetyScore}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant="outline" className={`text-xs ${
                      safetyScore >= 90 ? 'bg-green-100 text-green-800 border-green-300' :
                      safetyScore >= 70 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      'bg-red-100 text-red-800 border-red-300'
                    }`}>
                      {overallStatus}
                    </Badge>
                  </div>
                  {data?.serviceReportId?.mechanicNotes && (
                    <div className="py-2">
                      <span className="text-sm text-gray-600 font-medium block mb-2">Mechanic Notes</span>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{data?.serviceReportId?.mechanicNotes}</p>
                    </div>
                  )}
                  {recommendations.length > 0 && (
                    <div className="py-2">
                      <span className="text-sm text-gray-600 font-medium block mb-2">Recommendations</span>
                      <ul className="space-y-1">
                        {recommendations.map((rec: any, index: any) => (
                          <li key={index} className="text-sm text-gray-900 flex items-start gap-2 bg-yellow-50 p-2 rounded">
                            <span className="text-yellow-600 mt-1">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Report */}
              <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-teal-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">Detailed Service Report</h2>
                </div>
                <div className="space-y-3">
                  {(data?.serviceReportId?.reportItems || []).map((item: any, index: number) => (
                    <div key={index} className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {getConditionIcon(item.condition)}
                          <span className="font-semibold text-gray-900 text-sm">{item.feature}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-2">
                          <Badge
                            variant={item.condition === "excellent" ? "secondary" : "outline"}
                            className={`text-xs font-medium ${item.condition === "excellent"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : item.condition === "good"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                              }`}
                          >
                            {item.condition}
                          </Badge>
                          {item.needsAction && (
                            <Badge className="bg-red-600 text-white text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>
                      {item.remarks && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <span className="text-xs text-gray-500 font-medium block mb-1">Remarks:</span>
                          <p className="text-sm text-gray-700">{item.remarks}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pb-4">
                <div className="flex gap-2">
                  {shouldShowReports && (
                    <Button disabled={isLoadingReport} onClick={handleDownloadReport} className="w-full bg-blue-600 hover:bg-blue-700 h-10 focus:outline-none shadow-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  )}
                  {data?.status === "vehicle_returned" && shouldShowReports && <RatingButton
                    displayStyle='single-star'
                    size="sm"
                    serviceId={data?._id}
                    serviceType={ServiceType.PRETRIP}
                    serviceName="Pretrip Checkup"
                    hasRated={data?.ratingId?._id ? true : false}
                    userRating={data?.ratingId?.rating}
                    userReview={data?.ratingId?.review}
                    refetch={refetch}
                  />}
                </div>
                <Button disabled={isLoading} onClick={handleDownloadReceipt} variant="outline" className="w-full bg-white h-10 focus:outline-none shadow-sm">
                  <ReceiptText className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(-1)}>
            <Button variant="ghost" size="icon" className="focus:outline-none hover:bg-gray-100" aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Pretrip Analysis</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1 bg-white shadow-sm"
              aria-label="Refresh data"
              onClick={() => refetch()}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
            <Badge className={`${getStatusBadgeClass()} px-3 py-1`}>{getDisplayStatus()}</Badge>
          </div>
        </div>

        {/* Payment Status Alert */}
        {(isPaymentInitiated || isPaymentPending || isPaymentFailed) && (
          <div className={`rounded-lg border p-5 mb-6 ${
            isPaymentInitiated ? 'bg-orange-50 border-orange-200' :
            isPaymentPending ? 'bg-yellow-50 border-yellow-200' : 
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-4">
              {isPaymentInitiated ? (
                <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" />
              ) : isPaymentPending ? (
                <Clock className="h-6 w-6 text-yellow-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold text-base mb-2 ${
                  isPaymentInitiated ? 'text-orange-900' :
                  isPaymentPending ? 'text-yellow-900' : 
                  'text-red-900'
                }`}>
                  {isPaymentInitiated ? 'Payment Not Completed' : isPaymentPending ? 'Payment Pending' : 'Payment Failed'}
                </h3>
                <p className={`text-sm ${
                  isPaymentInitiated ? 'text-orange-800' :
                  isPaymentPending ? 'text-yellow-800' : 
                  'text-red-800'
                }`}>
                  {isPaymentInitiated 
                    ? 'Your payment was initiated but not completed. Please create a new booking to try again.'
                    : isPaymentPending 
                      ? 'Your payment is being processed. Please wait or refresh to check the latest status.'
                      : 'Your payment was unsuccessful. Please create a new booking to try again.'}
                </p>
                {(isPaymentInitiated || isPaymentFailed) && (
                  <Button 
                    onClick={handleRetryPayment}
                    size="sm"
                    className={`mt-4 ${
                      isPaymentInitiated 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    } text-white`}
                  >
                    Create New Booking
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <Card className="shadow-md border-0 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base font-semibold text-gray-900">
                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Car className="h-5 w-5 text-green-600" />
                </div>
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Registration</span>
                  <span className="font-semibold text-gray-900">{data?.vehicleId?.regNo}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Brand</span>
                  <span className="font-medium text-gray-900">{data?.vehicleId?.brand}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Model</span>
                  <span className="font-medium text-gray-900">{data?.vehicleId?.modelName}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Fuel Type</span>
                  <span className="font-medium text-gray-900">{data?.vehicleId?.fuelType}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-sm text-gray-600">Owner</span>
                  <span className="font-medium text-gray-900">{data?.vehicleId?.owner}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base font-semibold text-gray-900">
                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Service ID</span>
                  <span className="font-medium text-gray-900">{data?.bookingId}</span>
                </div>
                {data?.serviceReportId?.servicePlan?.name && (
                  <div className="flex justify-between py-2.5 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className="font-medium text-gray-900">{data?.serviceReportId?.servicePlan?.name}</span>
                  </div>
                )}
                <div className="flex justify-between py-2.5 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Schedule</span>
                  <span className="font-medium text-gray-900">{`${formatTime(data?.schedule?.start)} - ${formatTime(data?.schedule?.end)}`}</span>
                </div>
                {data?.serviceReportId?.servicePlan?.price && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-sm text-gray-600">Price</span>
                    <div className="flex items-center space-x-2">
                      {data?.serviceReportId?.servicePlan?.originalPrice && (
                        <span className="text-gray-500 line-through">₹{data?.serviceReportId?.servicePlan?.originalPrice}</span>
                      )}
                      <span className="font-semibold text-gray-900">₹{data?.serviceReportId?.servicePlan?.price}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md border-0 bg-white mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base font-semibold text-gray-900">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-600">Payment ID</span>
                <span className="font-medium text-gray-900">{data?.payment?.paymentId?.paymentId}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-600">Method</span>
                <span className="font-medium text-gray-900 capitalize">{data?.payment?.paymentId?.method}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-gray-100">
                <span className="text-sm text-gray-600">Status</span>
                <Badge 
                  className={`${
                    isPaymentSuccessful ? 'bg-green-100 text-green-800' : 
                    isPaymentInitiated ? 'bg-orange-100 text-orange-800' :
                    isPaymentPending ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {data?.payment?.status}
                </Badge>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="font-semibold text-gray-900">₹{data?.payment?.paymentId?.amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Show report sections only if payment is successful AND vehicle is returned */}
        {shouldShowReports && (
          <>
            <Card className="shadow-md border-0 bg-white mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base font-semibold text-gray-900">
                  <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  Overall Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Safety Score</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all"
                          style={{ width: `${safetyScore}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 min-w-[3rem] text-right">{safetyScore}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between py-2.5 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant="outline" className={`${
                      safetyScore >= 90 ? 'bg-green-100 text-green-800 border-green-300' :
                      safetyScore >= 70 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      'bg-red-100 text-red-800 border-red-300'
                    }`}>
                      {overallStatus}
                    </Badge>
                  </div>
                  {data?.serviceReportId?.mechanicNotes && (
                    <div className="py-2">
                      <span className="text-sm text-gray-600 font-medium block mb-2">Mechanic Notes</span>
                      <p className="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg">{data?.serviceReportId?.mechanicNotes}</p>
                    </div>
                  )}
                  {recommendations.length > 0 && (
                    <div className="py-2">
                      <span className="text-sm text-gray-600 font-medium block mb-2">Recommendations</span>
                      <ul className="space-y-2">
                        {recommendations.map((rec: any, index: any) => (
                          <li key={index} className="text-sm text-gray-900 flex items-start gap-2 bg-yellow-50 p-3 rounded-lg">
                            <span className="text-yellow-600 mt-0.5 font-bold">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 bg-white mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base font-semibold text-gray-900">
                  <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-teal-600" />
                  </div>
                  Detailed Service Report
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                  {(data?.serviceReportId?.reportItems || []).map((item: any, index: number) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getConditionIcon(item.condition)}
                          <span className="font-semibold text-gray-900">{item.feature}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={item.condition === "excellent" ? "secondary" : "outline"}
                            className={`font-medium ${
                              item.condition === "excellent"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : item.condition === "good"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {item.condition}
                          </Badge>
                          {item.needsAction && (
                            <Badge className="bg-red-600 text-white text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>
                      {item.remarks && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <span className="text-xs text-gray-500 font-medium block mb-1">Remarks:</span>
                          <p className="text-sm text-gray-700">{item.remarks}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3">
              {data?.status === "vehicle_returned" && shouldShowReports && <RatingButton
                displayStyle='stars'
                size="sm"
                serviceId={data?._id}
                serviceType={ServiceType.PRETRIP}
                serviceName="Pretrip Checkup"
                hasRated={data?.ratingId?._id ? true : false}
                userRating={data?.ratingId?.rating}
                userReview={data?.ratingId?.review}
                refetch={refetch}
              />}

              {shouldShowReports && (
                <>
                  <Button disabled={isLoadingReport} onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700 h-10 focus:outline-none shadow-sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button disabled={isLoading} onClick={handleDownloadReceipt} variant="outline" className="bg-white h-10 focus:outline-none shadow-sm">
                    <ReceiptText className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}