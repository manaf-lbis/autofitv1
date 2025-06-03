import { useSelector } from "react-redux";
import { useGetMechanicQuery } from "../api/registrationApi"; // Adjust path as needed
import {
  User,
  Mail,
  Phone,
  MapPin,
  Store,
  Calendar,
  Star,
  Eye,
  FileText,
  ImageIcon,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/store/store";
import { format } from "date-fns";

export default function Profile() {
  const { data: mechanicProfile, isLoading, error } = useGetMechanicQuery();

  const user = useSelector((state:RootState) => state.auth.user);

  if (isLoading) {
    return <div className="text-center text-slate-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: Loading</div>;
  }

  const avatarUrl = mechanicProfile?.data.photo || user?.avatar || null;

  const documents = {
    profilePhoto: {
      name: "Profile Photo",
      type: "image",
      uploaded: !!mechanicProfile?.data.photo,
      url: mechanicProfile?.data.photo,
    },
    shopImage: {
      name: "Shop Image",
      type: "image",
      uploaded: !!mechanicProfile?.data.shopImage,
      url: mechanicProfile?.data.shopImage,
    },
    qualification: {
      name: "Qualification Certificate",
      type: "pdf",
      uploaded: !!mechanicProfile?.data.qualification,
      url: mechanicProfile?.data.qualification,
    },
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy, hh:mm a");
  };

  const handleViewDocument = (document:any) => {
    if (document.url) {
      window.open(document.url, "_blank");
    }
  };

  return (
    <div className="space-y-6 h-full">
      {/* Profile Header */}
      <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-white/50 shadow-lg">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={user?.name} />
              ) : (
                <AvatarFallback className="bg-blue-500/90 text-white text-2xl font-semibold">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">{user?.name}</h2>
                <p className="text-slate-600 font-medium">{mechanicProfile?.data.shopName}</p>
                <p className="text-slate-500 text-sm">{mechanicProfile?.data.specialised}</p>
              </div>
              <div className="flex gap-3">
                <Badge
                  variant="outline"
                  className={`${
                    mechanicProfile?.data.registration.status === "approved"
                      ? "bg-green-50/80 text-green-700 border-green-200/50"
                      : mechanicProfile?.data.registration.status === "pending"
                      ? "bg-yellow-50/80 text-yellow-700 border-yellow-200/50"
                      : "bg-red-50/80 text-red-700 border-red-200/50"
                  } px-3 py-1`}
                >
                  {mechanicProfile?.data.registration.status.charAt(0).toUpperCase() +
                    mechanicProfile?.data.registration.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="bg-white/40 backdrop-blur-sm border-white/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100/60 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Email Address</p>
                  <p className="text-sm text-slate-600">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100/60 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Phone Number</p>
                  <p className="text-sm text-slate-600 font-mono">{user?.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100/60 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Member Since</p>
                  <p className="text-sm text-slate-600">{formatDate(mechanicProfile?.data.createdAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card className="bg-white/40 backdrop-blur-sm border-white/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Professional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100/60 rounded-lg">
                  <Store className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Shop Name</p>
                  <p className="text-sm text-slate-600">{mechanicProfile?.data.shopName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100/60 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Education</p>
                  <p className="text-sm text-slate-600">{mechanicProfile?.data.education}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100/60 rounded-lg">
                  <Award className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Experience</p>
                  <p className="text-sm text-slate-600">{mechanicProfile?.data.experience} years</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100/60 rounded-lg">
                  <Star className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Specialization</p>
                  <p className="text-sm text-slate-600">{mechanicProfile?.data.specialised}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Information */}
      <Card className="bg-white/40 backdrop-blur-sm border-white/30 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <MapPin className="h-5 w-5 text-blue-600" />
            Location Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100/60 rounded-lg">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Place</p>
                <p className="text-sm text-slate-600">{mechanicProfile?.data.place}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100/60 rounded-lg">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Landmark</p>
                <p className="text-sm text-slate-600">{mechanicProfile?.data.landmark}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="bg-white/40 backdrop-blur-sm border-white/30 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <FileText className="h-5 w-5 text-blue-600" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(documents).map(([key, document]) => (
              <div
                key={key}
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-4 hover:bg-white/80 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {document.type === "image" ? (
                      <ImageIcon className="h-5 w-5 text-blue-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-slate-700">{document.name}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      document.uploaded
                        ? "bg-green-50/80 text-green-700 border-green-200/50"
                        : "bg-red-50/80 text-red-700 border-red-200/50"
                    }`}
                  >
                    {document.uploaded ? "Uploaded" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase font-medium">{document.type}</span>
                  {document.uploaded && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDocument(document)}
                      className="h-8 w-8 p-0 hover:bg-blue-100/60"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}