
import { Clock } from "lucide-react"

export default function LiveAssistance() {
  return (
    <div className="text-center py-12 sm:py-20">
      <div className="max-w-sm mx-auto px-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-3">Coming Soon</h3>
        <p className="text-sm sm:text-base text-gray-600">Live Assistance service will be available soon</p>
      </div>
    </div>
  )
}
