// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   CheckCircle,
//   Clock,
//   XCircle,
//   FileText,
//   MapPin,
//   GraduationCap,
//   Briefcase,
//   Store,
//   Calendar,
//   LogOut,
//   RefreshCw,
//   AlertTriangle,
// } from "lucide-react";

// import { useResubmitRequestMutation } from "../../api/registrationApi";
// import { format } from "date-fns";
// import LogoutButton from "../LogoutButton";
// import toast from "react-hot-toast";
// import { ApiError } from "@/types/apiError";
// import { useNavigate } from "react-router-dom";

// interface RegistrationData {
//   status: string;
//   message: string;
//   data: {
//     registration: {
//       status: "pending" | "rejected";
//       rejectionReason: string;
//       approvedOn: string;
//       rejectedOn: string;
//     };
//     education: string;
//     specialised: string;
//     experience: number;
//     shopName: string;
//     place: string;
//     location: {
//       type: string;
//       coordinates: [number, number];
//     };
//     landmark: string;
//     photo: string;
//     shopImage: string;
//     qualification: string;
//     createdAt: string;
//   };
// }

// interface RegistrationStatusPageProps {
//   data?: RegistrationData;
// }

// export default function RegistrationStatusPage({
//   data,
// }: RegistrationStatusPageProps) {

//   const [resubmit, { isLoading: resubmitting }] = useResubmitRequestMutation();
//   const navigate = useNavigate()

//   const resubmitRequest = async ()=>{
//     try {
//       await resubmit({}).unwrap()
//       navigate('/mechanic/registration',{replace:true})
//     } catch (error:any) {
//       toast.error(error?.data?.message || 'Failed to Resubmit')
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return format(date, "MMMM d, yyyy, hh:mm a");
//   };

//   // Handle case where data is undefined or incomplete
//   if (!data || !data.data) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//         <Card className="bg-red-50 border-red-200 border-2 shadow-lg">
//           <CardContent className="p-8 text-center">
//             <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-6" />
//             <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
//             <p className="text-gray-600">
//               Unable to load registration data. Please try again later.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const {
//     registration,
//     education,
//     specialised,
//     experience,
//     createdAt,
//     shopName,
//     place,
//     location,
//     landmark,
//     photo,
//     shopImage,
//     qualification,
//   } = data.data;

//   const getStatusConfig = (status: "pending" | "rejected") => {
//     switch (status) {
//       case "pending":
//         return {
//           icon: <Clock className="w-12 h-12 text-yellow-600" />,
//           bgColor: "bg-yellow-50",
//           borderColor: "border-yellow-200",
//           iconBg: "bg-yellow-100",
//           title: "Application Under Review",
//           subtitle: "Your registration is being processed",
//           description:
//             "Thank you for submitting your application! Our team is currently reviewing your documents and information. We'll notify you once the review is complete.",
//           badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
//           badgeText: "Under Review",
//         };

//       case "rejected":
//         return {
//           icon: <XCircle className="w-12 h-12 text-red-600" />,
//           bgColor: "bg-red-50",
//           borderColor: "border-red-200",
//           iconBg: "bg-red-100",
//           title: "Application Rejected",
//           subtitle: "Please review and resubmit",
//           description: registration.rejectionReason,
//           badgeColor: "bg-red-100 text-red-800 border-red-300",
//           badgeText: "Rejected",
//         };
//     }
//   };

//   const statusConfig = getStatusConfig(registration.status);

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-4xl space-y-6">
//         {/* Main Status Card */}
//         <Card
//           className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 shadow-lg`}
//         >
//           <CardContent className="p-8 text-center">

//             <div
//               className={`mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full ${statusConfig.iconBg}`}
//             >
//               {statusConfig.icon}
//             </div>

//             <Badge
//               variant="outline"
//               className={`${statusConfig.badgeColor} mb-4 px-3 py-1 text-sm font-medium`}
//             >
//               {statusConfig.badgeText}
//             </Badge>

//             <h1 className="text-3xl font-bold text-gray-800 mb-2">
//               {statusConfig.title}
//             </h1>
//             <p className="text-lg text-gray-600 mb-4">
//               {statusConfig.subtitle}
//             </p>
//             <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
//               {statusConfig.description}
//             </p>

//             {/* Submission Date */}
//             <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
//               <Calendar className="w-4 h-4" />
//               <span>Submitted on {formatDate(createdAt)}</span>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Application Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Personal & Professional Info */}
//           <Card className="shadow-sm border-0">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-lg">
//                 <Briefcase className="w-5 h-5 text-gray-600" />
//                 Application Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="flex items-center gap-3">
//                   <Store className="w-4 h-4 text-gray-400" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">
//                       Shop Name
//                     </p>
//                     <p className="text-sm text-gray-600">{shopName}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <GraduationCap className="w-4 h-4 text-gray-400" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">
//                       Education
//                     </p>
//                     <p className="text-sm text-gray-600 uppercase">
//                       {education}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Briefcase className="w-4 h-4 text-gray-400" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">
//                       Experience
//                     </p>
//                     <p className="text-sm text-gray-600">{experience} years</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <FileText className="w-4 h-4 text-gray-400" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">
//                       Specialization
//                     </p>
//                     <p className="text-sm text-gray-600 uppercase">
//                       {specialised}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Location Info */}
//           <Card className="shadow-sm border-0">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-lg">
//                 <MapPin className="w-5 h-5 text-gray-600" />
//                 Location Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 gap-4">
//                 <div className="flex items-center gap-3">
//                   <MapPin className="w-4 h-4 text-gray-400" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">Place</p>
//                     <p className="text-sm text-gray-600">{place}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <MapPin className="w-4 h-4 text-gray-400" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">
//                       Landmark
//                     </p>
//                     <p className="text-sm text-gray-600">{landmark}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <MapPin className="w-4 h-4 text-gray-400" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">
//                       Coordinates
//                     </p>
//                     <p className="text-sm text-gray-600 font-mono">
//                       {location.coordinates[1].toFixed(6)},{" "}
//                       {location.coordinates[0].toFixed(6)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Documents Status */}
//         <Card className="shadow-sm border-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-lg">
//               <FileText className="w-5 h-5 text-gray-600" />
//               Submitted Documents
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                 <CheckCircle className="w-5 h-5 text-green-500" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">
//                     Profile Photo
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {photo ? "Uploaded" : "Not Uploaded"}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                 <CheckCircle className="w-5 h-5 text-green-500" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">
//                     Shop Image
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {shopImage ? "Uploaded" : "Not Uploaded"}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                 <CheckCircle className="w-5 h-5 text-green-500" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">
//                     Qualification
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {qualification ? "Uploaded" : "Not Uploaded"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           {registration.status === "rejected" && (
//             <Button
//               disabled={resubmitting}
//               onClick={resubmitRequest}
//               variant="outline"
//               className="flex items-center gap-2"
//             >
//               <RefreshCw
//                 className={`w-4 h-4 ${resubmitting ? "animate-spin" : ""}`}
//               />
//               Submit New Application
//             </Button>
//           )}

//           <LogoutButton />
//         </div>

//         {registration.status === "pending" && (
//           <Card className="bg-blue-50 border-blue-200 border shadow-sm">
//             <CardContent className="p-4">
//               <div className="flex items-start gap-3">
//                 <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-blue-800">
//                     What happens next?
//                   </p>
//                   <p className="text-sm text-blue-700 mt-1">
//                     Our team will review your application within 2-3 business
//                     days. You'll receive an email notification once the review
//                     is complete.
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }




import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  MapPin,
  GraduationCap,
  Briefcase,
  Store,
  Calendar,
  LogOut,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

import { useGetMechanicQuery, useResubmitRequestMutation } from "../../api/registrationApi";
import { format } from "date-fns";
import LogoutButton from "../LogoutButton";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PageLoading from "@/components/Animations/PageLoading";



export default function RegistrationStatusPage() {
  
  const [resubmit, { isLoading: resubmitting }] = useResubmitRequestMutation();
  const {data,isLoading} = useGetMechanicQuery()
  
  const navigate = useNavigate()

  const resubmitRequest = async ()=>{
    try {
      await resubmit({}).unwrap()
      navigate('/mechanic/registration',{replace:true})
    } catch (error:any) {
      toast.error(error?.data?.message || 'Failed to Resubmit')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy, hh:mm a");
  };

  if(isLoading) return <PageLoading />

  if (!data || !data.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Card className="bg-red-50 border-red-200 border-2 shadow-lg">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
            <p className="text-gray-600">
              Unable to load registration data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    registration,
    education,
    specialised,
    experience,
    createdAt,
    shopName,
    place,
    location,
    landmark,
    photo,
    shopImage,
    qualification,
  } = data.data;

  const getStatusConfig = (status: "pending" | "rejected") => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="w-12 h-12 text-yellow-600" />,
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          iconBg: "bg-yellow-100",
          title: "Application Under Review",
          subtitle: "Your registration is being processed",
          description:
            "Thank you for submitting your application! Our team is currently reviewing your documents and information. We'll notify you once the review is complete.",
          badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
          badgeText: "Under Review",
        };

      case "rejected":
        return {
          icon: <XCircle className="w-12 h-12 text-red-600" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconBg: "bg-red-100",
          title: "Application Rejected",
          subtitle: "Please review and resubmit",
          description: registration.rejectionReason,
          badgeColor: "bg-red-100 text-red-800 border-red-300",
          badgeText: "Rejected",
        };
    }
  };

  const statusConfig = getStatusConfig(registration.status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Main Status Card */}
        <Card
          className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 shadow-lg`}
        >
          <CardContent className="p-8 text-center">

            <div
              className={`mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full ${statusConfig.iconBg}`}
            >
              {statusConfig.icon}
            </div>

            <Badge
              variant="outline"
              className={`${statusConfig.badgeColor} mb-4 px-3 py-1 text-sm font-medium`}
            >
              {statusConfig.badgeText}
            </Badge>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {statusConfig.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {statusConfig.subtitle}
            </p>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {statusConfig.description}
            </p>

            {/* Submission Date */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Submitted on {formatDate(createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Application Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal & Professional Info */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5 text-gray-600" />
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <Store className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Shop Name
                    </p>
                    <p className="text-sm text-gray-600">{shopName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Education
                    </p>
                    <p className="text-sm text-gray-600 uppercase">
                      {education}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Experience
                    </p>
                    <p className="text-sm text-gray-600">{experience} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Specialization
                    </p>
                    <p className="text-sm text-gray-600 uppercase">
                      {specialised}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-gray-600" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Place</p>
                    <p className="text-sm text-gray-600">{place}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Landmark
                    </p>
                    <p className="text-sm text-gray-600">{landmark}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Coordinates
                    </p>
                    <p className="text-sm text-gray-600 font-mono">
                      {location.coordinates[1].toFixed(6)},{" "}
                      {location.coordinates[0].toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Status */}
        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-gray-600" />
              Submitted Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Profile Photo
                  </p>
                  <p className="text-xs text-gray-500">
                    {photo ? "Uploaded" : "Not Uploaded"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Shop Image
                  </p>
                  <p className="text-xs text-gray-500">
                    {shopImage ? "Uploaded" : "Not Uploaded"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Qualification
                  </p>
                  <p className="text-xs text-gray-500">
                    {qualification ? "Uploaded" : "Not Uploaded"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {registration.status === "rejected" && (
            <Button
              disabled={resubmitting}
              onClick={resubmitRequest}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${resubmitting ? "animate-spin" : ""}`}
              />
              Submit New Application
            </Button>
          )}

          <LogoutButton />
        </div>

        {registration.status === "pending" && (
          <Card className="bg-blue-50 border-blue-200 border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    What happens next?
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Our team will review your application within 2-3 business
                    days. You'll receive an email notification once the review
                    is complete.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
