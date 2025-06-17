// import { useState, useEffect } from "react"
// import { CheckCircle2, XCircle, ArrowLeft, Download, RefreshCw, Home, Clock, AlertTriangle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useNavigate, useParams, useSearchParams } from "react-router-dom"

// interface PaymentDetails {
//   orderId: string
//   transactionId: string
//   amount: number
//   serviceName: string
//   vehicleId: string
//   paymentMethod: string
//   timestamp: string
// }

// const paymentDetails: PaymentDetails = {
//   orderId: "ORD-2024-001234",
//   transactionId: "TXN-" + Date.now(),
//   amount: 1500,
//   serviceName: "Battery Jump Start",
//   vehicleId: "ABC-1234",
//   paymentMethod: "Stripe",
//   timestamp: new Date().toISOString(),
// }

// export default function PaymentStatusPage() {
//   const router = useNavigate()
//   const [searchParams] = useSearchParams()
//   const [countdown, setCountdown] = useState(10)
//   const [isAnimated, setIsAnimated] = useState(false)
//   const navigate = useNavigate()

//   const {status} = useParams()
//   const isSuccess = status === "success"

//   useEffect(() => {
//     // Trigger animation on mount
//     setTimeout(() => setIsAnimated(true), 100)

//     // Countdown timer
//     const timer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer)
//           navigate('/user/service-history')
//           return 0
//         }
//         return prev - 1
//       })
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [router])

//   const handleGoBack = () => {
//     // router.push("/services")
//   }

//   const handleGoHome = () => {
//     // router.push("/")
//   }

//   const handleRetryPayment = () => {
//     // router.push("/payment")
//   }

//   const handleDownloadReceipt = () => {
//     console.log("Downloading receipt...")
//   }

//   if (isSuccess) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
//         <div className="max-w-md w-full">
//           <div
//             className={`bg-white rounded-xl p-8 shadow-xl border border-green-100 text-center transform transition-all duration-1000 ${
//               isAnimated ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
//             }`}
//           >
//             {/* Success Animation */}
//             <div className="relative mb-6">
//               <div
//                 className={`w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto transform transition-all duration-700 delay-300 ${
//                   isAnimated ? "scale-100 rotate-0" : "scale-0 rotate-180"
//                 }`}
//               >
//                 <CheckCircle2 className="h-10 w-10 text-green-600" />
//               </div>
//               {/* Success Ring Animation */}
//               <div
//                 className={`absolute inset-0 w-20 h-20 mx-auto border-4 border-green-200 rounded-full transition-all duration-1000 delay-500 ${
//                   isAnimated ? "scale-150 opacity-0" : "scale-100 opacity-100"
//                 }`}
//               />
//             </div>

//             <div
//               className={`transform transition-all duration-700 delay-700 ${
//                 isAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
//               }`}
//             >
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
//               <p className="text-gray-600 mb-6">Your payment has been processed successfully</p>

//               {/* Payment Details */}
//               <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Service</span>
//                     <span className="font-medium text-gray-900">{paymentDetails.serviceName}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Vehicle</span>
//                     <span className="font-medium text-gray-900">{paymentDetails.vehicleId}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Amount</span>
//                     <span className="font-bold text-green-600">₹{paymentDetails.amount.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Payment Method</span>
//                     <span className="font-medium text-gray-900">{paymentDetails.paymentMethod}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Transaction ID</span>
//                     <span className="font-mono text-xs font-medium text-gray-900">{paymentDetails.transactionId}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="space-y-3">
//                 <Button onClick={handleDownloadReceipt} className="w-full bg-green-600 hover:bg-green-700 text-white">
//                   <Download className="h-4 w-4 mr-2" />
//                   Download Receipt
//                 </Button>

//                 <div className="grid grid-cols-2 gap-3">
//                   <Button onClick={handleGoBack} variant="outline" className="border-gray-300">
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Services
//                   </Button>
//                   <Button onClick={handleGoHome} variant="outline" className="border-gray-300">
//                     <Home className="h-4 w-4 mr-2" />
//                     Home
//                   </Button>
//                 </div>
//               </div>

//               {/* Auto Redirect Notice */}
//               <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
//                 <Clock className="h-4 w-4" />
//                 <span>Redirecting in {countdown} seconds</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Payment Failed Page
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         <div
//           className={`bg-white rounded-xl p-8 shadow-xl border border-red-100 text-center transform transition-all duration-1000 ${
//             isAnimated ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
//           }`}
//         >
//           {/* Failure Animation */}
//           <div className="relative mb-6">
//             <div
//               className={`w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto transform transition-all duration-700 delay-300 ${
//                 isAnimated ? "scale-100 rotate-0" : "scale-0 -rotate-180"
//               }`}
//             >
//               <XCircle className="h-10 w-10 text-red-600" />
//             </div>
//             {/* Failure Ring Animation */}
//             <div
//               className={`absolute inset-0 w-20 h-20 mx-auto border-4 border-red-200 rounded-full transition-all duration-1000 delay-500 ${
//                 isAnimated ? "scale-150 opacity-0" : "scale-100 opacity-100"
//               }`}
//             />
//           </div>

//           <div
//             className={`transform transition-all duration-700 delay-700 ${
//               isAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
//             }`}
//           >
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
//             <p className="text-gray-600 mb-6">We couldn't process your payment. Please try again.</p>

//             {/* Failure Reasons */}
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//               <div className="flex items-start gap-3">
//                 <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
//                 <div className="text-left">
//                   <p className="text-sm font-medium text-red-800 mb-1">Common reasons for payment failure:</p>
//                   <ul className="text-xs text-red-700 space-y-1">
//                     <li>• Insufficient funds in your account</li>
//                     <li>• Incorrect card details or expired card</li>
//                     <li>• Network connectivity issues</li>
//                     <li>• Bank security restrictions</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Order Details */}
//             <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Order ID</span>
//                   <span className="font-mono text-xs font-medium text-gray-900">{paymentDetails.orderId}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Service</span>
//                   <span className="font-medium text-gray-900">{paymentDetails.serviceName}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Amount</span>
//                   <span className="font-bold text-gray-900">₹{paymentDetails.amount.toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-3">
//               <Button onClick={handleRetryPayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                 <RefreshCw className="h-4 w-4 mr-2" />
//                 Retry Payment
//               </Button>

//               <div className="grid grid-cols-2 gap-3">
//                 <Button onClick={handleGoBack} variant="outline" className="border-gray-300">
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Services
//                 </Button>
//                 <Button onClick={handleGoHome} variant="outline" className="border-gray-300">
//                   <Home className="h-4 w-4 mr-2" />
//                   Home
//                 </Button>
//               </div>
//             </div>

//             {/* Auto Redirect Notice */}
//             <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
//               <Clock className="h-4 w-4" />
//               <span>Redirecting in {countdown} seconds</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }





import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, ArrowLeft, Download, RefreshCw, Home, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

interface PaymentDetails {
  orderId: string
  transactionId: string
  amount: number
  serviceName: string
  vehicleId: string
  paymentMethod: string
  timestamp: string
}

const paymentDetails: PaymentDetails = {
  orderId: "ORD-2024-001234",
  transactionId: "TXN-" + Date.now(),
  amount: 1500,
  serviceName: "Battery Jump Start",
  vehicleId: "ABC-1234",
  paymentMethod: "Stripe",
  timestamp: new Date().toISOString(),
}

export default function PaymentStatusPage() {
  const router = useNavigate()
  const [searchParams] = useSearchParams()
  const [countdown, setCountdown] = useState(10)
  const [isAnimated, setIsAnimated] = useState(false)
  const navigate = useNavigate()

  const {status} = useParams()
  const isSuccess = status === "success"

  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 100)
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/user/service-history')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleGoBack = () => {
    // router.push("/services")
  }

  const handleGoHome = () => {
    // router.push("/")
  }

  const handleRetryPayment = () => {
    // router.push("/payment")
  }

  const handleDownloadReceipt = () => {
    console.log("Downloading receipt...")
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div
            className={`bg-white rounded-xl p-8 shadow-xl border border-green-100 text-center transform transition-all duration-1000 ${
              isAnimated ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
            }`}
          >
            {/* Success Animation */}
            <div className="relative mb-6">
              <div
                className={`w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto transform transition-all duration-700 delay-300 ${
                  isAnimated ? "scale-100 rotate-0" : "scale-0 rotate-180"
                }`}
              >
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              {/* Success Ring Animation */}
              <div
                className={`absolute inset-0 w-20 h-20 mx-auto border-4 border-green-200 rounded-full transition-all duration-1000 delay-500 ${
                  isAnimated ? "scale-150 opacity-0" : "scale-100 opacity-100"
                }`}
              />
            </div>

            <div
              className={`transform transition-all duration-700 delay-700 ${
                isAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">Your payment has been processed successfully</p>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium text-gray-900">{paymentDetails.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle</span>
                    <span className="font-medium text-gray-900">{paymentDetails.vehicleId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-bold text-green-600">₹{paymentDetails.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900">{paymentDetails.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-xs font-medium text-gray-900">{paymentDetails.transactionId}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={handleDownloadReceipt} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handleGoBack} variant="outline" className="border-gray-300">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Services
                  </Button>
                  <Button onClick={handleGoHome} variant="outline" className="border-gray-300">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </div>
              </div>

              {/* Auto Redirect Notice */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Redirecting in {countdown} seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Payment Failed Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div
          className={`bg-white rounded-xl p-8 shadow-xl border border-red-100 text-center transform transition-all duration-1000 ${
            isAnimated ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
          }`}
        >
          {/* Failure Animation */}
          <div className="relative mb-6">
            <div
              className={`w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto transform transition-all duration-700 delay-300 ${
                isAnimated ? "scale-100 rotate-0" : "scale-0 -rotate-180"
              }`}
            >
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            {/* Failure Ring Animation */}
            <div
              className={`absolute inset-0 w-20 h-20 mx-auto border-4 border-red-200 rounded-full transition-all duration-1000 delay-500 ${
                isAnimated ? "scale-150 opacity-0" : "scale-100 opacity-100"
              }`}
            />
          </div>

          <div
            className={`transform transition-all duration-700 delay-700 ${
              isAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">We couldn't process your payment. Please try again.</p>

            {/* Failure Reasons */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-red-800 mb-1">Common reasons for payment failure:</p>
                  <ul className="text-xs text-red-700 space-y-1">
                    <li>• Insufficient funds in your account</li>
                    <li>• Incorrect card details or expired card</li>
                    <li>• Network connectivity issues</li>
                    <li>• Bank security restrictions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-xs font-medium text-gray-900">{paymentDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium text-gray-900">{paymentDetails.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-gray-900">₹{paymentDetails.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleRetryPayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Payment
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleGoBack} variant="outline" className="border-gray-300">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Services
                </Button>
                <Button onClick={handleGoHome} variant="outline" className="border-gray-300">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>

            {/* Auto Redirect Notice */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Redirecting in {countdown} seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
