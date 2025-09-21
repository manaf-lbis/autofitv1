import { useState } from "react"
import { MapPin, GraduationCap, Store, Calendar, CheckCircle, Eye, FileText, X, Download, ExternalLink, ClockArrowUp, PenBox, KeyRound, ArrowRight } from "lucide-react"
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
    ;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
          <p className="text-red-600" role="alert">{errMsg}</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/mechanic/dashboard")}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg">
          <p className="text-gray-600" role="alert">No profile data found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/mechanic/dashboard")}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const mechanic = data.data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative max-w-7xl">

        {/* Hero Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden mb-8">
          <div className="relative bg-slate-800 p-8">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-lg rotate-12"></div>
              <div className="absolute top-8 right-8 w-12 h-12 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-6 left-12 w-8 h-8 border-2 border-white rotate-45"></div>
              <div className="absolute bottom-8 right-16 w-6 h-6 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-white rounded-full opacity-50"></div>
              <div className="absolute top-1/3 right-1/4 w-10 h-10 border border-white rounded-lg rotate-45"></div>
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                    <LazyImage publicId={mechanic.photo} resourceType={'image'} alt="Profile" />

                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold uppercase">{mechanic.mechanicId.name}</h1>
                  <p className="text-gray-300 text-lg">{mechanic.specialised}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-500/90 text-white border-0 hover:bg-green-500/90">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Professional
                    </Badge>
                  </div>
                </div>
              </div>


              <Button onClick={() => setIsUpdateModalOpen(true)} variant="outline" size="sm" aria-label="View shop location on map">
                <PenBox className="w-4 h-4 mr-2" />
                Update Profile
              </Button>


            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Quick Info */}
          <div className="space-y-6">


            {/* Personal Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Education</p>
                    <p className="font-semibold text-gray-900">{mechanic.education}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-900">
                      {format(new Date(mechanic.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registration Status</p>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 capitalize">{mechanic.registration.status}</p>
                      {mechanic.registration.approvedOn && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {format(new Date(mechanic.registration.approvedOn), "MMM d, yyyy")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border border-gray-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Qualification Certificate</p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setShowDocument(!showDocument)}
                      aria-label="View qualification document"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-800"
                      onClick={handleDownload}
                      aria-label="Download qualification document"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>







             <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-3">
                <div
                  onClick={()=> navigate('/mechanic/change-password')}
                 className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border border-gray-200/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <KeyRound className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Change Password</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                  
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-800"

                      aria-label="Download qualification document"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Shop Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shop Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Store className="w-5 h-5" /> Shop Information
                  </h2>
                  <div>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => setIsModalOpen(true)} >
                      <ClockArrowUp className="w-4 h-4 mr-2" />
                      Update Working Hours
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleViewOnMap} aria-label="View shop location on map">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Map
                    </Button>
                  </div>

                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{mechanic.shopName}</h3>
                    <p className="text-gray-600 flex items-center gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      {mechanic.place}, {mechanic.landmark}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50/80 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Specialization</h4>
                      <p className="text-blue-700">{mechanic.specialised}</p>
                    </div>

                    <div className="bg-green-50/80 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 mb-2">Location </h4>
                      <LatLngToAddress className="text-green-700 text-sm" lat={mechanic.location.coordinates[1].toFixed(6)} lng={mechanic.location.coordinates[0].toFixed(6)} />
                    </div>

                    <div className="bg-purple-50/80 rounded-xl p-4">
                      <h4 className="font-semibold text-purple-900 mb-2">Coordinates</h4>
                      <p className="text-purple-700 text-sm font-mono">
                        {mechanic.location.coordinates[1].toFixed(6)},{" "}
                        {mechanic.location.coordinates[0].toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <LazyImage publicId={mechanic.shopImage} resourceType={'image'} alt="Shop" />
                  </div>
                </div>
              </div>
            </div>

            {/* Document Viewer */}
            {showDocument && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/30 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Qualification Document
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDocument(false)}
                    aria-label="Close document viewer"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="p-6">
                  <div className="bg-gray-50/80 rounded-xl p-4">
                    <iframe
                      src={getAssetURL(mechanic.qualification, 'raw')}
                      className="w-full h-[600px] rounded-lg border border-gray-200 shadow-inner"
                      title="Qualification Document"
                      onError={() => toast.error("Failed to load document")}
                    />

                  </div>
                </div>
              </div>
            )}

            <WorkingHoursModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <UpdateProfileModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} initialData={{ ...mechanic, name: user?.name, email: user?.email, mobile: user?.mobile, location: mechanic?.location?.coordinates?.join(',') }} onSave={handleProfileUpdate} />
          </div>
        </div>
      </div>
    </div>
  )
}
