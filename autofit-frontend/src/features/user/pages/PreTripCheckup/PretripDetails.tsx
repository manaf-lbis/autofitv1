import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePretripDetailsQuery } from "@/services/userServices/pretripUserApi"
import {
  Car,
  CreditCard,
  ArrowLeft,
  Calendar,
  RefreshCw,
  FileText,
  Download,
  Receipt,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

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
  const { data } = usePretripDetailsQuery({ id: id! }, { skip: !id });
  const navigate = useNavigate();

  const safetyScore = calculateSafetyScore(data?.serviceReportId?.reportItems || []);
  const overallStatus = getOverallStatus(safetyScore);
  const recommendations = (data?.serviceReportId?.reportItems || []).filter((item: any) => item.needsAction).map((item: any) => `Check ${item.feature}`);

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
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              <Badge className="bg-green-500 text-white text-xs">{data?.status}</Badge>
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4 space-y-4">
          {/* Vehicle Info */}
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Car className="h-4 w-4 text-green-600" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">Vehicle Info</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Registration</span>
                <span className="font-medium text-gray-900 text-sm">{data?.vehicleId?.regNo}</span>
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
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">Service Plan & Schedule</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Plan</span>
                <span className="font-medium text-gray-900 text-sm">{data?.serviceReportId?.servicePlan?.name}</span>
              </div>
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Schedule</span>
                <span className="font-medium text-gray-900 text-sm text-right">{`${formatTime(data?.schedule?.start)} - ${formatTime(data?.schedule?.end)}`}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Price</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 line-through text-sm">₹{data?.serviceReportId?.servicePlan?.originalPrice}</span>
                  <span className="font-medium text-gray-900 text-sm">₹{data?.serviceReportId?.servicePlan?.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">Payment Info</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Payment ID</span>
                <span className="font-medium text-gray-900 text-sm text-right break-all">{data?.payment?.paymentId?.paymentId}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Mode</span>
                <span className="font-medium text-gray-900 capitalize text-sm">{data?.payment?.paymentId?.method}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Status</span>
                <span className="font-medium text-gray-900 capitalize text-sm">{data?.payment?.status}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="font-medium text-gray-900 text-sm">₹{data?.payment?.paymentId?.amount}</span>
              </div>
            </div>
          </div>

          {/* Overall Assessment */}
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="h-4 w-4 text-indigo-600" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">Overall Assessment</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Safety Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{ width: `${safetyScore}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900 text-sm">{safetyScore}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                  {overallStatus}
                </Badge>
              </div>
              <div className="py-2">
                <span className="text-sm text-gray-600 block mb-2">Mechanic Notes</span>
                <p className="text-sm text-gray-900">{data?.serviceReportId?.mechanicNotes}</p>
              </div>
              {recommendations.length > 0 && (
                <div className="py-2">
                  <span className="text-sm text-gray-600 block mb-2">Recommendations</span>
                  <ul className="space-y-1">
                    {recommendations.map((rec:any, index:any) => (
                      <li key={index} className="text-sm text-gray-900 flex items-start gap-2">
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
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-medium text-gray-900">Service Report</h2>
            </div>
            <div className="space-y-3">
              {(data?.serviceReportId?.reportItems || []).map((item: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getConditionIcon(item.condition)}
                      <span className="font-medium text-gray-900 text-sm truncate">{item.feature}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2">
                      <Badge
                        variant={item.condition === "excellent" ? "secondary" : "outline"}
                        className={`text-xs ${
                          item.condition === "excellent"
                            ? "bg-green-100 text-green-800"
                            : item.condition === "good"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.condition}
                      </Badge>
                      {item.needsAction && (
                        <Badge variant="destructive" className="text-xs">
                          Action Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  {item.remarks && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500 block mb-1">Remarks:</span>
                      <p className="text-sm text-gray-700">{item.remarks}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pb-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10 focus:outline-none">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" className="w-full bg-transparent h-10 focus:outline-none">
              <Receipt className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Unchanged */}
      <div className="hidden md:block p-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3" onClick={() => navigate(-1)}>
            <Button variant="ghost" size="icon" className="focus:outline-none" aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Pretrip Analysis</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1 bg-transparent"
              aria-label="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Badge className="bg-green-500 text-white">{data?.status}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-gray-900">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Car className="h-4 w-4 text-green-600" />
                </div>
                Vehicle Info
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Registration</span>
                  <span className="font-medium text-gray-900">{data?.vehicleId?.regNo}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Brand</span>
                  <span className="font-medium text-gray-900">{data?.vehicleId?.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Model</span>
                  <span className="font-medium text-gray-900">{data?.vehicleId?.modelName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Fuel Type</span>
                  <span className="font-medium text-gray-900">{data?.vehicleId?.fuelType}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Owner</span>
                  <span className="font-medium text-gray-900">{data?.vehicleId?.owner}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-gray-900">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                Service Plan & Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900">{data?.serviceReportId?.servicePlan?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Schedule</span>
                  <span className="font-medium text-gray-900">{`${formatTime(data?.schedule?.start)} - ${formatTime(data?.schedule?.end)}`}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Price</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 line-through">₹{data?.serviceReportId?.servicePlan?.originalPrice}</span>
                    <span className="font-medium text-gray-900">₹{data?.serviceReportId?.servicePlan?.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-0 bg-white mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-gray-900">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              Payment Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Payment ID</span>
                <span className="font-medium text-gray-900">{data?.payment?.paymentId?.paymentId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Mode</span>
                <span className="font-medium text-gray-900 capitalize">{data?.payment?.paymentId?.method}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Status</span>
                <span className="font-medium text-gray-900 capitalize">{data?.payment?.status}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="font-medium text-gray-900">₹{data?.payment?.paymentId?.amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-gray-900">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="h-4 w-4 text-indigo-600" />
              </div>
              Overall Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Safety Score</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-yellow-500 rounded-full"
                      style={{ width: `${safetyScore}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900">{safetyScore}%</span>
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  {overallStatus}
                </Badge>
              </div>
              <div className="py-2">
                <span className="text-sm text-gray-600 block mb-2">Mechanic Notes</span>
                <p className="text-sm text-gray-900">{data?.serviceReportId?.mechanicNotes}</p>
              </div>
              <div className="py-2">
                <span className="text-sm text-gray-600 block mb-2">Recommendations</span>
                <ul className="space-y-1">
                  {recommendations.map((rec:any, index:any) => (
                    <li key={index} className="text-sm text-gray-900 flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-white mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-gray-900">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              Service Report
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
              {(data?.serviceReportId?.reportItems || []).map((item: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getConditionIcon(item.condition)}
                      <span className="font-medium text-gray-900">{item.feature}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={item.condition === "excellent" ? "secondary" : "outline"}
                        className={
                          item.condition === "excellent"
                            ? "bg-green-100 text-green-800"
                            : item.condition === "good"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {item.condition}
                      </Badge>
                      {item.needsAction && (
                        <Badge variant="destructive" className="text-xs">
                          Action Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  {item.remarks && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500 block mb-1">Remarks:</span>
                      <p className="text-sm text-gray-700">{item.remarks}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700 h-9 focus:outline-none">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button variant="outline" className="bg-transparent h-9 focus:outline-none">
            <Receipt className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  )
}