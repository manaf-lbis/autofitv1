import { useState } from "react"
import { MapPin, GraduationCap, Store, Calendar, CheckCircle, Eye, FileText, X, Download, ExternalLink, Clock, PenBox, KeyRound, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useGetMechanicQuery, useUpdateProfileMutation } from "../../../services/mechanicServices/mechanicApi"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import LatLngToAddress from "@/components/shared/LocationInput/LatLngToAddress"
import AccountShimmer from "../components/shimmer/AccountShimmer"
import LazyImage from "@/components/shared/LazyImage"
import { getAssetURL } from "@/utils/utilityFunctions/getAssetURL"
import WorkingHoursModal from "../components/workingHours/WorkingHoursModal"
import { UpdateProfileModal } from "../components/registration/UpdateProfileModal"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { RatingStars } from "@/components/shared/rating/RatingStar"
import { ReviewListingModal } from "@/components/shared/rating/ReviewListingModal"

export default function Account() {

  const [showDocument, setShowDocument] = useState(false)
  const { data, isLoading, isError, error } = useGetMechanicQuery()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false)
  const user = useSelector((state: RootState) => state.auth.user)
  const [updateProfile] = useUpdateProfileMutation()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleDownload = () => {
    if (data?.data?.qualification) {
      try {
        const link = document.createElement("a")
        link.href = data.data.qualification
        link.download = "qualification-certificate.pdf"
        link.click()
        toast.success("Download started")
      } catch {
        toast.error("Failed to download document")
      }
    } else {
      toast.error("Document not available")
    }
  }

  const handleProfileUpdate = async (data: any) => {
    try {
      const res = await updateProfile(data).unwrap();
      toast.success(res?.message);
      setIsUpdateModalOpen(false)
    } catch (error: any) {
      toast.error(error.data.message)
    }
  }

  const handleViewOnMap = () => {
    if (data?.data?.location?.coordinates) {
      const [lng, lat] = data.data.location.coordinates
      const url = `https://www.google.com/maps?q=${lat},${lng}`
      window.open(url, "_blank")
    } else {
      toast.error("Location data not available")
    }
  }

  if (isLoading) {
    return (<AccountShimmer />)
  }

  if (isError) {
    const errMsg = error instanceof Error ? error.message : "Failed to load profile data"
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg max-w-md w-full">
          <p className="text-red-600 text-sm sm:text-base" role="alert">{errMsg}</p>
          <Button variant="outline" className="mt-4 w-full sm:w-auto" onClick={() => navigate("/mechanic/dashboard")}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg max-w-md w-full">
          <p className="text-gray-600 text-sm sm:text-base" role="alert">No profile data found</p>
          <Button variant="outline" className="mt-4 w-full sm:w-auto" onClick={() => navigate("/mechanic/dashboard")}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const mechanic = data.data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5"></div>
      <div className="absolute top-20 left-10 w-20 h-20 sm:w-32 sm:h-32 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 sm:w-24 sm:h-24 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 sm:w-40 sm:h-40 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative max-w-7xl">

        {/* Hero Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden mb-4 sm:mb-6 lg:mb-8">
          <div className="relative bg-slate-800 p-4 sm:p-6 lg:p-8">
            {/* Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-8 h-8 sm:w-16 sm:h-16 border-2 border-white rounded-lg rotate-12"></div>
              <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-6 h-6 sm:w-12 sm:h-12 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-3 sm:bottom-6 left-6 sm:left-12 w-4 h-4 sm:w-8 sm:h-8 border-2 border-white rotate-45"></div>
            </div>

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-2 sm:border-4 border-white shadow-xl overflow-hidden bg-white">
                    <LazyImage publicId={mechanic.photo} resourceType={'image'} alt="Profile" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="text-white flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold uppercase truncate">{mechanic.mechanicId.name}</h1>
                    <ReviewListingModal mechanic={{
                      name: mechanic.mechanicId.name,
                      averageRating: data?.data?.rating?.avg,
                      id: mechanic.mechanicId._id,
                      avatarUrl: mechanic.photo,
                      reviewsCount: data?.data?.rating?.reviews
                    }}
                   triggerClassName="text-xs sm:text-sm w-5 h-5 text-green-800"
                   userType="mechanic"
                    
                    />

                  </div>

                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg truncate">{mechanic.specialised}</p>
                  
                  {/* Rating Section */}
                 {data?.data?.rating?.avg && <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <RatingStars rating={data?.data?.rating?.avg} size={14} />
                    </div>
                    <Badge className="bg-yellow-500/90 text-white border-0 hover:bg-yellow-500/90 text-xs w-fit">
                      <Star className="w-3 h-3 mr-1" />
                      {data?.data?.rating?.reviews} Total
                    </Badge>

                  </div>}

                  
                </div>
              </div>

              <Button 
                onClick={() => setIsUpdateModalOpen(true)} 
                variant="outline" 
                size="sm" 
                className="w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap"
                aria-label="Update profile"
              >
                <PenBox className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Update Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">

            {/* Personal Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Personal Information</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500">Education</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{mechanic.education}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {format(new Date(mechanic.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500">Registration Status</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 capitalize text-sm sm:text-base">{mechanic.registration.status}</p>
                      {mechanic.registration.approvedOn && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {format(new Date(mechanic.registration.approvedOn), "MMM d, yy")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Documents</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border border-gray-200/50 gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">Qualification Certificate</p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 p-1 sm:p-2"
                      onClick={() => setShowDocument(!showDocument)}
                      aria-label="View document"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-800 p-1 sm:p-2"
                      onClick={handleDownload}
                      aria-label="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Change Password</h3>
              <div className="space-y-3">
                <div
                  onClick={() => navigate('/mechanic/change-password')}
                  className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border border-gray-200/50 cursor-pointer hover:bg-gray-100/80 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <KeyRound className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Change Password</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800 p-1 sm:p-2 flex-shrink-0"
                    aria-label="Go to change password"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Shop Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Shop Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Store className="w-4 h-4 sm:w-5 sm:h-5" /> Shop Information
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs sm:text-sm w-full sm:w-auto" 
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Update Hours
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs sm:text-sm w-full sm:w-auto" 
                      onClick={handleViewOnMap}
                    >
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      View on Map
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{mechanic.shopName}</h3>
                    <p className="text-gray-600 flex items-start gap-2 mt-2 text-sm sm:text-base">
                      <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="break-words">{mechanic.place}, {mechanic.landmark}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-blue-50/80 rounded-xl p-3 sm:p-4">
                      <h4 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Specialization</h4>
                      <p className="text-blue-700 text-sm sm:text-base break-words">{mechanic.specialised}</p>
                    </div>

                    <div className="bg-green-50/80 rounded-xl p-3 sm:p-4">
                      <h4 className="font-semibold text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">Location</h4>
                      <LatLngToAddress className="text-green-700 text-xs sm:text-sm break-words" lat={mechanic.location.coordinates[1].toFixed(6)} lng={mechanic.location.coordinates[0].toFixed(6)} />
                    </div>

                    <div className="bg-purple-50/80 rounded-xl p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                      <h4 className="font-semibold text-purple-900 mb-1 sm:mb-2 text-sm sm:text-base">Coordinates</h4>
                      <p className="text-purple-700 text-xs sm:text-sm font-mono break-all">
                        {mechanic.location.coordinates[1].toFixed(6)},{" "}
                        {mechanic.location.coordinates[0].toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 rounded-lg overflow-hidden">
                    <LazyImage publicId={mechanic.shopImage} resourceType={'image'} alt="Shop" />
                  </div>
                </div>
              </div>
            </div>

            {/* Document Viewer */}
            {showDocument && (
              <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/30 flex justify-between items-center gap-2">
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> 
                    <span className="truncate">Qualification Document</span>
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDocument(false)}
                    className="flex-shrink-0"
                    aria-label="Close document"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="bg-gray-50/80 rounded-xl p-2 sm:p-4">
                    <iframe
                      src={getAssetURL(mechanic.qualification, 'raw')}
                      className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg border border-gray-200 shadow-inner"
                      title="Qualification Document"
                      onError={() => toast.error("Failed to load document")}
                    />
                  </div>
                </div>
              </div>
            )}

            <WorkingHoursModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <UpdateProfileModal 
              isOpen={isUpdateModalOpen} 
              onClose={() => setIsUpdateModalOpen(false)} 
              initialData={{ 
                ...mechanic, 
                name: user?.name, 
                email: user?.email, 
                mobile: user?.mobile, 
                location: mechanic?.location?.coordinates?.join(',') 
              }} 
              onSave={handleProfileUpdate} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}