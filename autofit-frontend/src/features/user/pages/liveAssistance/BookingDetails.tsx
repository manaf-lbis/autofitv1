import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Calendar, User, AlertCircle, XCircle, Video, CreditCard, CheckCircle, RefreshCw, Download } from "lucide-react";
import { VideoCallModal } from "@/components/shared/VideoCallModal";
import { useNavigate, useParams } from "react-router-dom";
import { LiveAssistanceStatus } from "@/types/liveAssistance";
import { useGenerateInvoiceMutation, useGetCallSessionIdQuery, useLiveBookingDetailsQuery, useMarkAsCompletedMutation } from "@/services/userServices/liveAssistanceApi";
import { DetailsPageShimer } from "../../components/shimmer/liveAssistance/DetailsPageShimer";
import toast from "react-hot-toast";

interface BookingData {
  _id: string;
  issue: string;
  description: string;
  price: number;
  startTime: string;
  endTime: string;
  status: LiveAssistanceStatus;
  mechanicName: string;
  mechanicEmail: string;
  paymentInfo: {
    amount: number;
    status: string;
    receipt: string;
    method: string;
  };
}

const getStatusConfig = (status: LiveAssistanceStatus) => {
  switch (status) {
    case LiveAssistanceStatus.PENDING:
      return { color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock, label: "Pending" };
    case LiveAssistanceStatus.ONGOING:
      return { color: "bg-green-50 text-green-700 border-green-200", icon: Video, label: "Ongoing" };
    case LiveAssistanceStatus.COMPLETED:
      return { color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle, label: "Completed" };
    case LiveAssistanceStatus.CANCELLED:
      return { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle, label: "Cancelled" };
    case LiveAssistanceStatus.TIMEOUT:
      return { color: "bg-muted text-muted-foreground border-border", icon: AlertCircle, label: "Timeout" };
    default:
      return { color: "bg-muted text-muted-foreground border-border", icon: Clock, label: "Unknown" };
  }
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function BookingDetailsPage() {
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [generateReceipt, { isLoading: isReceiptLoading }] = useGenerateInvoiceMutation();
  const [markAsCompleted, { isLoading: isMarkingCompleted }] = useMarkAsCompletedMutation();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isFetching, refetch } = useLiveBookingDetailsQuery(id!);
  const { data: sessionDetails } = useGetCallSessionIdQuery(id!, { skip: data?.data?.status !== LiveAssistanceStatus.ONGOING });

  const bookingData = useMemo<BookingData | undefined>(() => {
    if (!data?.data) return undefined;
    return {
      _id: data.data._id,
      issue: data.data.issue,
      description: data.data.description,
      price: data.data.price,
      startTime: data.data.startTime,
      endTime: data.data.endTime, 
      status: data.data.status as LiveAssistanceStatus,
      mechanicName: data.data.mechanicId.name,
      mechanicEmail: data.data.mechanicId.email,
      paymentInfo: {
        amount: data.data.paymentId.amount,
        status: data.data.paymentId.status,
        receipt: data.data.paymentId.receipt,
        method: "credit_card",
      },
    };
  }, [data?.data]);

  useEffect(() => {
    if (!bookingData || bookingData.status !== LiveAssistanceStatus.ONGOING) return;

    const endTime = new Date(bookingData.endTime).getTime();
    const currentTime = Date.now();
    const initialRemaining = Math.max(0, endTime - currentTime);
    setTimeRemaining(Math.floor(initialRemaining / 1000));

    const timer = setInterval(() => {
      const currentTime = Date.now();
      const remaining = Math.max(0, endTime - currentTime);
      setTimeRemaining(Math.floor(remaining / 1000));
      
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingData]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const statusConfig = getStatusConfig(bookingData?.status || LiveAssistanceStatus.PENDING);
  const StatusIcon = statusConfig.icon;

  const handleJoinCall = () => {
    try {
      setIsVideoCallOpen(true);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      if (!bookingData) return;
      
      await markAsCompleted({ serviceId: bookingData._id }).unwrap();
      toast.success("Call marked as completed successfully");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to mark call as completed");
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      if (!bookingData) {
        toast.error('Failed to download');
        return;
      }

      await generateReceipt({ serviceId: bookingData._id }).unwrap();
      toast.success("Invoice downloaded successfully");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to download invoice");
    }
  };

  if (isFetching || !bookingData) {
    return <DetailsPageShimer />;
  }

  // Use actual status from backend data
  const isJoinButtonVisible = bookingData.status === LiveAssistanceStatus.ONGOING && timeRemaining > 0;
  const isMarkCompleteVisible = bookingData.status === LiveAssistanceStatus.ONGOING;
  const isDownloadVisible = bookingData.status === LiveAssistanceStatus.COMPLETED;

  return (
    <div className="min-h-screen mb-24 md:mb-0">
      {/* Mobile Layout */}
      <div className="block md:hidden bg-gray-50">
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
              <h1 className="text-lg font-semibold text-gray-900">Live Assistance</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-2"
              aria-label="Refresh data"
              onClick={refetch}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-4">

          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-md">
                  <StatusIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex gap-3">
                      <h2 className="text-sm font-medium text-gray-900">Call Status</h2>
                      <Badge className={`${statusConfig.color} font-medium text-xs`}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">Current consultation status</p>
                  </div>
                </div>
              </div>
              
              {isDownloadVisible && (
                <button 
                  onClick={handleDownloadInvoice}
                  disabled={isReceiptLoading}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm font-medium">Invoice</span>
                </button>
              )}
            </div>
            
            {isJoinButtonVisible && (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 bg-red-50 px-3 py-2 rounded-md">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="text-red-600 font-mono text-sm font-medium">{formatCountdown(timeRemaining)}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleJoinCall}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium h-10"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Call
                  </Button>
                  {isMarkCompleteVisible && (
                    <Button
                      onClick={handleMarkAsCompleted}
                      disabled={isMarkingCompleted}
                      variant="outline"
                      className="px-4 h-10 border-green-200 text-green-700 hover:bg-green-50"
                    >
                      {isMarkingCompleted ? (
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Done
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Issue Description</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{bookingData.description}</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-lg font-bold text-gray-900">₹{bookingData.price}</div>
                <div className="text-xs text-gray-600">Amount</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-lg font-bold text-gray-900">30</div>
                <div className="text-xs text-gray-600">Minutes</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-lg font-bold text-gray-900">Video</div>
                <div className="text-xs text-gray-600">Call Type</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-green-100 rounded-md">
                <Calendar className="h-3 w-3 text-green-600" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">Schedule</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Booking Date</span>
                <span className="text-sm text-gray-900 font-medium">{formatDateTime(bookingData.startTime)}</span>
              </div>
              <div className="h-px bg-gray-100"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Start Time</span>
                <span className="text-sm text-gray-900 font-medium">{formatTime(bookingData.startTime)}</span>
              </div>
              <div className="h-px bg-gray-100"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">End Time</span>
                <span className="text-sm text-gray-900 font-medium">{formatTime(bookingData.endTime)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-purple-100 rounded-md">
                <User className="h-3 w-3 text-purple-600" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">Assigned Mechanic</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm text-gray-900 font-medium">{bookingData.mechanicName}</span>
              </div>
              <div className="h-px bg-gray-100"></div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm text-gray-900 font-mono text-right break-all">{bookingData.mechanicEmail}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-orange-100 rounded-md">
                <CreditCard className="h-3 w-3 text-orange-600" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">Payment Details</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-md">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">Amount</span>
                <p className="text-lg font-bold text-gray-900">₹{bookingData.paymentInfo.amount}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">Method</span>
                  <p className="text-xs text-gray-900 capitalize">{bookingData.paymentInfo.method}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">Status</span>
                  <Badge
                    className={`${bookingData.paymentInfo.status === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"} text-xs`}
                  >
                    {bookingData.paymentInfo.status}
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">Receipt</span>
                <p className="text-xs text-gray-900 font-mono break-all">{bookingData.paymentInfo.receipt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block min-h-screen max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3" onClick={() => navigate(-1)}>
              <Button variant="ghost" size="icon" className="focus:outline-none" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900">Live Assistance Details</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 bg-transparent"
                aria-label="Refresh data"
                onClick={refetch}
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            <div className="xl:col-span-3 space-y-6">
              <Card className="border-border shadow-sm rounded-md">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-md">
                        <StatusIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex gap-4">
                            <CardTitle className="text-lg text-card-foreground">Call Status</CardTitle>
                            <Badge className={`${statusConfig.color} font-medium shrink-0`}>{statusConfig.label}</Badge>
                          </div>
                          <CardDescription>Current status of your consultation</CardDescription>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isJoinButtonVisible && (
                        <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-md">
                          <Clock className="h-4 w-4 text-red-600" />
                          <span className="text-red-600 font-mono text-sm">{formatCountdown(timeRemaining)}</span>
                        </div>
                      )}
                      
                      {isDownloadVisible && (
                        <button 
                          onClick={handleDownloadInvoice}
                          disabled={isReceiptLoading}
                          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                        >
                          <Download className="h-4 w-4" />
                          <span className="text-sm font-medium">Invoice</span>
                        </button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {(isJoinButtonVisible || isMarkCompleteVisible) && (
                  <CardContent className="pt-0">
                    <div className="flex gap-3">
                      {isJoinButtonVisible && (
                        <Button
                          onClick={handleJoinCall}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-6"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Video Call
                        </Button>
                      )}
                      
                      {isMarkCompleteVisible && (
                        <Button
                          onClick={handleMarkAsCompleted}
                          disabled={isMarkingCompleted}
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50 h-10 px-6"
                        >
                          {isMarkingCompleted ? (
                            <>
                              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                              Completing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Completed
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
              
              <Card className="border-border shadow-sm rounded-md">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">Issue Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-card-foreground leading-relaxed">{bookingData.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
                    <div className="text-center p-3 bg-muted/30 rounded-md">
                      <div className="text-lg sm:text-xl font-bold text-card-foreground">₹{bookingData.price}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Total Amount</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-md">
                      <div className="text-lg sm:text-xl font-bold text-card-foreground">30</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Minutes</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-md">
                      <div className="text-lg sm:text-xl font-bold text-card-foreground">Video</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Call Type</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border shadow-sm rounded-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                      <div className="p-1.5 bg-green-100 rounded-md">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Booking Date</span>
                        <span className="text-sm text-card-foreground font-medium">{formatDateTime(bookingData.startTime)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Start Time</span>
                        <span className="text-sm text-card-foreground font-medium">{formatTime(bookingData.startTime)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">End Time</span>
                        <span className="text-sm text-card-foreground font-medium">{formatTime(bookingData.endTime)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-border shadow-sm rounded-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                      <div className="p-1.5 bg-purple-100 rounded-md">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      Assigned Mechanic
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Name</span>
                        <span className="text-sm text-card-foreground font-medium">{bookingData.mechanicName}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                        <span className="text-sm text-card-foreground font-mono break-words">{bookingData.mechanicEmail}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="xl:col-span-1">
              <Card className="border-border shadow-sm xl:sticky xl:top-24 rounded-md">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 rounded-md">
                      <CreditCard className="h-4 w-4 text-orange-600" />
                    </div>
                    Payment Details
                  </CardTitle>
                  <CardDescription>Transaction information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-muted/30 rounded-md">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Amount</span>
                      <p className="text-lg font-bold text-card-foreground">₹{bookingData.paymentInfo.amount}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/30 rounded-md">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Method</span>
                        <p className="text-sm text-card-foreground capitalize">{bookingData.paymentInfo.method}</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-md">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Status</span>
                        <Badge
                          className={`${bookingData.paymentInfo.status === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"} text-xs`}
                        >
                          {bookingData.paymentInfo.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-md">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">Receipt</span>
                      <p className="text-xs text-card-foreground font-mono break-all">{bookingData.paymentInfo.receipt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {sessionDetails && isVideoCallOpen && createPortal(
          <VideoCallModal
            isOpen={isVideoCallOpen}
            onClose={() => setIsVideoCallOpen(false)}
            mechanicName={bookingData.mechanicName}
            bookingTime={bookingData.startTime}
            sessionId={sessionDetails.data.sessionId}
            role="user"
            userId={sessionDetails.data?.userId}
          />,
          document.body
        )}
      </div>
    </div>
  );
}