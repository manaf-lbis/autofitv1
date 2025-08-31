import { useState, useEffect } from "react"
import ScheduleManagement from "../../components/jobs/ScheduleManagement"  
import { ServiceHistory } from "../../components/jobs/ServiceHistory" 


export default function PretripCheckup() {

  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
        {/* Compact Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Schedule Management</h1>
          <p className="text-gray-600 text-sm">Manage your availability and service bookings</p>
        </div>

        <div className="mb-6">
          <ScheduleManagement/>
        </div>

        <ServiceHistory mode="pretrip" loading={loading}/>
      </div>
    </div>
  )
}
