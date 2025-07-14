import { useState } from "react";
import { ArrowLeft,MapPin, GraduationCap,Briefcase, Store, FileText, ImageIcon,Ban, Calendar, Mail, User, Phone, FileIcon, ExternalLink, CheckCircle,AlertTriangle} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { useGetMechanicDetailsQuery, useUpdateMechanicStatusMutation, useApplicationStatusMutation } from "../../../../services/adminServices/mechanicManagement";
import toast from "react-hot-toast";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import LazyImage from "@/components/shared/LazyImage";
import { getAssetURL } from "@/utils/utilityFunctions.ts/getAssetURL";

const rejectFormSchema = z.object({
  reason: z
    .string()
    .min(10, { message: "Rejection reason must be at least 10 characters long" })
    .max(500, { message: "Rejection reason cannot exceed 500 characters" })
    .nonempty({ message: "Rejection reason is required" }),
});

type RejectFormValues = z.infer<typeof rejectFormSchema>;

export default function MechanicDetails() {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useGetMechanicDetailsQuery(id!);
  const [updateMechanicStatus, { isLoading: isUpdating }] = useUpdateMechanicStatusMutation();
  const [updateApplicationStatus, { isLoading: isUpdatingApplication }] = useApplicationStatusMutation();

  const photoId = data?.data?.mechanicProfile?.photo;
  const shopImageId = data?.data?.mechanicProfile?.shopImage;
  const qualificationId = data?.data?.mechanicProfile?.qualification;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RejectFormValues>({
    resolver: zodResolver(rejectFormSchema),
    defaultValues: { reason: "" },
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleBlock = async () => {
    try {
      await updateMechanicStatus({ id: id!, status: "blocked" }).unwrap();
      setShowBlockDialog(false);
      toast.success("Mechanic blocked successfully");
      refetch();
    } catch (error) {
      console.error("Failed to block mechanic:", error);
      toast.error("Failed to block mechanic");
    }
  };

  const handleUnblock = async () => {
    try {
      await updateMechanicStatus({ id: id!, status: "active" }).unwrap();
      setShowUnblockDialog(false);
      toast.success("Mechanic unblocked successfully");
      refetch();
    } catch (error) {
      console.error("Failed to unblock mechanic:", error);
      toast.error("Failed to unblock mechanic");
    }
  };

  const handleApprove = async () => {
    if (!data?.data.mechanicProfile) return;
    try {
      await updateApplicationStatus({ id: data.data.mechanicProfile._id, status: "approved" }).unwrap();
      setShowApproveDialog(false);
      toast.success("Application approved successfully");
      refetch();
    } catch (error) {
      console.error("Failed to approve application:", error);
      toast.error("Failed to approve application");
    }
  };

  const handleReject = async (formData: RejectFormValues) => {
    if (!data?.data.mechanicProfile) return;
    try {
      await updateApplicationStatus({
        id: data.data.mechanicProfile._id,
        status: "rejected",
        rejectionReason: formData.reason,
      }).unwrap();
      setShowRejectDialog(false);
      toast.success("Application rejected successfully");
      reset();
      refetch();
    } catch (error) {
      console.error("Failed to reject application:", error);
      toast.error("Failed to reject application");
    }
  };

  const openDocument = (url: string | null) => {
    if (url) window.open(url, "_blank");
    else toast.error("Document not available");
  };

  const mapContainerStyle = { width: "100%", height: "192px" };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" aria-label="Loading" />
    </div>
  );

  if (error || !data?.data?.mechanic) return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
      <p className="text-gray-600" role="alert">
        {error ? "Failed to load mechanic data" : "No mechanic data found"}
      </p>
    </div>
  );

  const { mechanic, mechanicProfile } = data.data;
  const mapCenter = mechanicProfile
    ? { lat: mechanicProfile.location.coordinates[1], lng: mechanicProfile.location.coordinates[0] }
    : { lat: 0, lng: 0 };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Mechanic Application</h1>
            <p className="text-sm text-gray-500">View and manage mechanic information</p>
          </div>
        </div>

        <Card className={cn("border-0 shadow-sm", mechanic.status === "active" && "bg-green-50 border-green-200", mechanic.status === "blocked" && "bg-red-50 border-red-200", mechanic.status === "inactive" && "bg-yellow-50 border-yellow-200")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {mechanic.status === "active" ? <CheckCircle className="h-5 w-5 text-green-600" /> : mechanic.status === "blocked" ? <Ban className="h-5 w-5 text-red-600" /> : <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                <div>
                  <p className={cn("font-medium", mechanic.status === "active" && "text-green-800", mechanic.status === "blocked" && "text-red-800", mechanic.status === "inactive" && "text-yellow-800")}>
                    {mechanic.status === "active" ? "Active Account" : mechanic.status === "blocked" ? "Blocked Account" : "Inactive Account"}
                  </p>
                  {mechanicProfile && (
                    <p className={cn("text-sm", mechanic.status === "active" && "text-green-600", mechanic.status === "blocked" && "text-red-600", mechanic.status === "inactive" && "text-yellow-600")}>
                      Registered: {formatDateTime(mechanicProfile.createdAt)}
                    </p>
                  )}
                </div>
              </div>
              <Badge variant="outline" className={cn(mechanic.status === "active" && "bg-green-100 text-green-800 border-green-300", mechanic.status === "blocked" && "bg-red-100 text-red-800 border-red-300", mechanic.status === "inactive" && "bg-yellow-100 text-yellow-800 border-yellow-300")}>
                {mechanic.status.charAt(0).toUpperCase() + mechanic.status.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-gray-600">{mechanic.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-sm text-gray-600">{mechanic.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Phone Number</p>
                  <p className="text-sm text-gray-600 font-mono">{mechanic.mobile}</p>
                </div>
              </div>
              {mechanicProfile && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-sm text-gray-600">{formatDate(mechanicProfile.createdAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {mechanicProfile ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-gray-600" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3">
                      <Store className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Shop Name</p>
                        <p className="text-sm text-gray-600">{mechanicProfile.shopName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Education</p>
                        <p className="text-sm text-gray-600">{mechanicProfile.education.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Experience</p>
                        <p className="text-sm text-gray-600">{mechanicProfile.experience} years</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Specialization</p>
                        <p className="text-sm text-gray-600">{mechanicProfile.specialised.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Registration Status</p>
                        <Badge variant="outline" className={cn(
                          mechanicProfile.registration.status === "pending" && "bg-yellow-100 text-yellow-800 border-yellow-200",
                          mechanicProfile.registration.status === "approved" && "bg-green-100 text-green-800 border-green-200",
                          mechanicProfile.registration.status === "rejected" && "bg-red-100 text-red-800 border-red-200"
                        )}>
                          {mechanicProfile.registration.status.charAt(0).toUpperCase() + mechanicProfile.registration.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    Location Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Place</p>
                        <p className="text-sm text-gray-600">{mechanicProfile.place}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Landmark</p>
                        <p className="text-sm text-gray-600">{mechanicProfile.landmark}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mt-2">
                    {loadError ? (
                      <div className="flex items-center justify-center h-full text-red-600">
                        <AlertTriangle className="h-6 w-6 mr-2" />
                        Failed to load map
                      </div>
                    ) : !isLoaded ? (
                      <div className="flex items-center justify-center h-full text-gray-600">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2" />
                        Loading map...
                      </div>
                    ) : (
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={mapCenter}
                        zoom={15}
                        options={{
                          disableDefaultUI: true,
                          zoomControl: true,
                          fullscreenControl: true,
                        }}
                      >
                        <Marker position={mapCenter} />
                      </GoogleMap>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="photo" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="photo">Profile Photo</TabsTrigger>
                    <TabsTrigger value="shop">Shop Image</TabsTrigger>
                    <TabsTrigger value="qualification">Qualification</TabsTrigger>
                  </TabsList>
                  <TabsContent value="photo" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm">Profile Photo</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Image</Badge>
                      </div>
                      <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white">
                       <LazyImage publicId={photoId} resourceType={'image'} />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDocument(getAssetURL(photoId,'image'))}
                          aria-label="Open original profile photo"
                          disabled={!photoId}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />Open Original
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="shop" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm">Shop Image</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Image</Badge>
                      </div>
                      <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white">
                        <LazyImage publicId={shopImageId} resourceType={'image'} />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDocument(getAssetURL(shopImageId,'image'))}
                          aria-label="Open original shop image"
                          disabled={!shopImageId}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />Open Original
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="qualification" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm">Qualification Document</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">PDF</Badge>
                      </div>
                      <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center">
                        <FileIcon className="h-16 w-16 text-red-500 mb-4" />
                        <p className="text-sm font-medium">Qualification Certificate</p>
                        <p className="text-xs text-gray-500 mt-1">PDF Document</p>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDocument(getAssetURL(qualificationId,'raw'))}
                          aria-label="View qualification PDF"
                          disabled={!qualificationId}
                        >
                          <FileIcon className="h-4 w-4 mr-2" />View PDF
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center text-gray-500">
              <p>Profile information not available. The mechanic has not completed registration.</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-4 pt-4 flex-wrap">
          {mechanicProfile?.registration.status === "pending" && (
            <>
              <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogTrigger asChild>
                  <Button variant="default" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />Approve Application
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Mechanic Application</DialogTitle>
                  </DialogHeader>
                  <p>Are you sure you want to approve this application?</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setShowApproveDialog(false)}>Cancel</Button>
                    <Button onClick={handleApprove} disabled={isUpdatingApplication}>
                      {isUpdatingApplication ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Approving...
                        </>
                      ) : "Approve"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showRejectDialog} onOpenChange={(open) => { setShowRejectDialog(open); if (!open) reset(); }}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <CheckCircle className="h-4 w-4 mr-2" />Reject Application
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Mechanic Application</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(handleReject)} className="space-y-4">
                    <p className="text-sm text-gray-600">Please provide a reason for rejecting this application.</p>
                    <div>
                      <Textarea
                        {...register("reason")}
                        placeholder="Enter rejection reason (e.g., incomplete documents, insufficient experience)"
                        className={cn("min-h-[100px] resize-y", errors.reason && "border-red-500 focus:ring-red-500")}
                        aria-invalid={!!errors.reason}
                        aria-describedby={errors.reason ? "reason-error" : undefined}
                      />
                      {errors.reason && (
                        <p id="reason-error" className="mt-1 text-sm text-red-600" role="alert">{errors.reason.message}</p>
                      )}
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="font-medium text-sm">{mechanic.name}</p>
                      <p className="text-sm text-gray-500">{mechanic.email}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button type="button" variant="outline" onClick={() => { setShowRejectDialog(false); reset(); }}>Cancel</Button>
                      <Button type="submit" variant="destructive" disabled={isUpdatingApplication}>
                        {isUpdatingApplication ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Rejecting...
                          </>
                        ) : "Reject"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}

          {mechanic.status === "active" && (
            <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" aria-label="Block mechanic">
                  <Ban className="h-4 w-4 mr-2" />Block Mechanic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Block Mechanic Account</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-gray-600">Are you sure you want to block this mechanic? This will prevent them from accessing the platform and accepting new jobs.</p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-medium text-sm">{mechanic.name}</p>
                    <p className="text-sm text-gray-500">{mechanic.email}</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowBlockDialog(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleBlock} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Blocking...
                      </>
                    ) : "Block Account"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {mechanic.status === "blocked" && (
            <Dialog open={showUnblockDialog} onOpenChange={setShowUnblockDialog}>
              <DialogTrigger asChild>
                <Button variant="default" aria-label="Unblock mechanic">
                  <CheckCircle className="h-4 w-4 mr-2" />Unblock Mechanic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Unblock Mechanic Account</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-gray-600">Are you sure you want to unblock this mechanic? This will restore their access to the platform.</p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-medium text-sm">{mechanic.name}</p>
                    <p className="text-sm text-gray-500">{mechanic.email}</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setShowUnblockDialog(false)}>Cancel</Button>
                  <Button variant="default" onClick={handleUnblock} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Unblocking...
                      </>
                    ) : "Unblock Account"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}

