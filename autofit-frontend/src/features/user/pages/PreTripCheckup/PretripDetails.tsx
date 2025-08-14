import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  CreditCard,
  ArrowLeft,
  Calendar,
  RefreshCw,
  FileText,
  Download,
  Receipt,
  Wrench,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const mockData = {
  assignedMechanic: {
    shopName: "AutoCare Service Center",
    place: "Kochi",
    location: "MG Road, Ernakulam",
  },
  vehicle: {
    registration: "KL23N8253",
    brand: "Tata",
    model: "Punch",
    fuelType: "Diesel",
    owner: "MANAF",
    isBlocked: false,
  },
  schedule: {
    start: "2024-01-15T09:00:00",
    end: "2024-01-15T11:30:00",
  },
  payment: {
    paymentId: "pay_QszVgUai2rKGgf",
    amount: 350,
    method: "netbanking",
    status: "success",
    receipt: "rcpt_md38lm8s_omh",
  },
  servicePlan: {
    name: "Essential",
    description: "Perfect for short trips",
    originalPrice: 2999,
    price: 999,
  },
  reportItems: [
    {
      feature: "Tire pressure check",
      condition: "good",
      needsAction: false,
      remarks: "All tires properly inflated to recommended PSI",
    },
    {
      feature: "Engine oil level",
      condition: "low",
      needsAction: true,
      remarks: "Oil level below minimum mark, requires immediate top-up",
    },
    {
      feature: "Brake fluid check",
      condition: "good",
      needsAction: false,
      remarks: "Brake fluid level within normal range",
    },
    {
      feature: "Battery voltage",
      condition: "fair",
      needsAction: false,
      remarks: "Battery voltage at 12.2V, monitor for potential replacement",
    },
    {
      feature: "Headlight functionality",
      condition: "poor",
      needsAction: true,
      remarks: "Left headlight dim, bulb replacement required",
    },
    {
      feature: "Windshield wipers",
      condition: "good",
      needsAction: false,
      remarks: "Wipers functioning properly, blades in good condition",
    },
    {
      feature: "Horn functionality",
      condition: "good",
      needsAction: false,
      remarks: "Horn working at appropriate volume",
    },
    {
      feature: "Seat belt check",
      condition: "good",
      needsAction: false,
      remarks: "All seat belts retract and lock properly",
    },
  ],
  overallAssessment: {
    status: "Needs Attention",
    summary:
      "Vehicle is generally in good condition but requires immediate attention for engine oil level and headlight replacement before trip.",
    safetyScore: 75,
    recommendations: [
      "Top up engine oil immediately",
      "Replace left headlight bulb",
      "Monitor battery voltage over next few weeks",
    ],
  },
  status: "report_created",
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

const getConditionIcon = (condition: string) => {
  switch (condition) {
    case "good":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "fair":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "poor":
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-600" />
  }
}

export default function PretripDetails() {

  const navigate = useNavigate()


  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto">
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
          <Badge className="bg-green-500 text-white">{mockData.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-gray-900">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <Wrench className="h-4 w-4 text-orange-600" />
              </div>
              Assigned Mechanic
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Shop Name</span>
                <span className="font-medium text-gray-900">{mockData.assignedMechanic.shopName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Place</span>
                <span className="font-medium text-gray-900">{mockData.assignedMechanic.place}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Location</span>
                <span className="font-medium text-gray-900">{mockData.assignedMechanic.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <span className="font-medium text-gray-900">{mockData.vehicle.registration}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Brand</span>
                <span className="font-medium text-gray-900">{mockData.vehicle.brand}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Model</span>
                <span className="font-medium text-gray-900">{mockData.vehicle.model}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Fuel Type</span>
                <span className="font-medium text-gray-900">{mockData.vehicle.fuelType}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Owner</span>
                <span className="font-medium text-gray-900">{mockData.vehicle.owner}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-0 bg-white mb-6">
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
              <span className="font-medium text-gray-900">{mockData.servicePlan.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Schedule</span>
              <span className="font-medium text-gray-900">{`${formatTime(mockData.schedule.start)} - ${formatTime(mockData.schedule.end)}`}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Price</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 line-through">₹{mockData.servicePlan.originalPrice}</span>
                <span className="font-medium text-gray-900">₹{mockData.servicePlan.price}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <span className="font-medium text-gray-900">{mockData.payment.paymentId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Mode</span>
              <span className="font-medium text-gray-900 capitalize">{mockData.payment.method}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Status</span>
              <span className="font-medium text-gray-900 capitalize">{mockData.payment.status}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="font-medium text-gray-900">₹{mockData.payment.amount}</span>
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
                    style={{ width: `${mockData.overallAssessment.safetyScore}%` }}
                  />
                </div>
                <span className="font-medium text-gray-900">{mockData.overallAssessment.safetyScore}%</span>
              </div>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Status</span>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                {mockData.overallAssessment.status}
              </Badge>
            </div>
            <div className="py-2">
              <span className="text-sm text-gray-600 block mb-2">Summary</span>
              <p className="text-sm text-gray-900">{mockData.overallAssessment.summary}</p>
            </div>
            <div className="py-2">
              <span className="text-sm text-gray-600 block mb-2">Recommendations</span>
              <ul className="space-y-1">
                {mockData.overallAssessment.recommendations.map((rec, index) => (
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
            {mockData.reportItems.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getConditionIcon(item.condition)}
                    <span className="font-medium text-gray-900">{item.feature}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={item.condition === "good" ? "secondary" : "outline"}
                      className={
                        item.condition === "good"
                          ? "bg-green-100 text-green-800"
                          : item.condition === "fair"
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
  )
}
