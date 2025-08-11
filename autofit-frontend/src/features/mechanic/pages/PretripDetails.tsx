import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Navigation, Car, CreditCard, ArrowLeft, Calendar, RefreshCw, FileText } from "lucide-react"
import { PretripReportModal } from "../components/jobs/PretripReportModal" 

// interface CheckupItem {
//   id: string
//   label: string
//   checked: boolean
// }

export default function PretripDetails() {
  const [isNavModalOpen, setIsNavModalOpen] = useState<boolean>(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  // const [showReport, setShowReport] = useState(false)
  // const [checkupItems, setCheckupItems] = useState<CheckupItem[]>([])
  // const [mechanicNotes, setMechanicNotes] = useState("")
  // const [selectedPlan, setSelectedPlan] = useState("basic")
  // const [reportCompleted, setReportCompleted] = useState(false)

  const handleBack = () => {
    console.log("Going back...")
  }

  const handleRefresh = () => {
    console.log("Refreshing...")
  }

  const handleNavigate = () => {
    setIsNavModalOpen(!isNavModalOpen)
  }

  const handleCreateReport = () => {
    setIsReportModalOpen(true)
  }

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6 flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleBack} className="focus:outline-none">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm text-gray-600">Back</span>
      </div>

      {/* Status Badge and Refresh */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center space-x-1 focus:outline-none bg-transparent"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
        <Badge className="bg-green-500 text-white">Completed</Badge>
      </div>

      {/* Customer & Vehicle Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="shadow-sm border-0 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-sm font-medium text-gray-900">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              Customer Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Name</span>
                <span className="font-medium text-gray-900">Abdul Manaf s</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Email</span>
                <span className="font-medium text-gray-900">user@gmail.com</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Mobile</span>
                <span className="font-medium text-gray-900">9633565414</span>
              </div>
            </div>
            <Button
              onClick={handleNavigate}
              className="w-full bg-blue-600 hover:bg-blue-700 mt-4 h-9 focus:outline-none"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Start Navigate
            </Button>
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
                <span className="font-medium text-gray-900">KL23N8253</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Brand</span>
                <span className="font-medium text-gray-900">Tata</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Model</span>
                <span className="font-medium text-gray-900">Punch</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Owner</span>
                <span className="font-medium text-gray-900">MANAF</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Plan & Schedule */}
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
              <span className="font-medium text-gray-900">Basic Service Plan</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Schedule</span>
              <span className="font-medium text-gray-900">10:00 AM - 12:00 PM</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Price</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 line-through">$120</span>
                <span className="font-medium text-gray-900">$89</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
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
              <span className="font-medium text-gray-900">PAY-789456123</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Mode</span>
              <span className="font-medium text-gray-900">Credit Card</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="font-medium text-gray-900">$89</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Report Button */}
      <div className="space-y-3">
        <Button onClick={handleCreateReport} className="w-full bg-blue-600 hover:bg-blue-700 h-10 focus:outline-none">
          <FileText className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>
      <PretripReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        bookingData={{
          user: { name: "Abdul Manaf s", email: "user@gmail.com", mobile: "9633565414" },
          vehicle: { registration: "KL23N8253", brand: "Tata", model: "Punch", owner: "MANAF" },
          plan: { name: "Basic Service Plan", price: 89, originalPrice: 120, schedule: "10:00 AM - 12:00 PM" },
          payment: { paymentId: "PAY-789456123", mode: "Credit Card", amount: 89 },
        }}
      />
    </div>
  )
}
