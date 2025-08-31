import { useState, useRef, useEffect } from "react"
import RoadsideAssistance from "../../components/profile/serviceHistory/RoadsideAssistance"
import PretripCheckup from "../../components/profile/serviceHistory/PretripCheckup" 
import LiveAssistance from "../../components/profile/serviceHistory/LiveAssistance" 

export default function ServiceHistoryPage() {
  const [activeTab, setActiveTab] = useState("roadside")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 200

      if (scrolledToBottom) {
        console.log("Dispatching nearBottom event")
        window.dispatchEvent(new CustomEvent("nearBottom"))
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="h-[calc(100vh-110px)] flex flex-col bg-gray-50 overflow-hidden">
      <div className="bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Service History</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Track and manage your service requests</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-6 pb-4">
          <div className="bg-white rounded-md shadow-sm border border-gray-100 p-1">
            <nav className="flex bg-gray-50 rounded-md p-1 gap-1">
              <button
                onClick={() => setActiveTab("roadside")}
                className={`relative py-2.5 sm:py-3 px-3 sm:px-6 rounded-md font-medium text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none ${
                  activeTab === "roadside"
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <span className="relative z-10">
                  <span className="block sm:inline">Roadside</span>
                  <span className="hidden xs:inline sm:inline"> Assistance</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("pretrip")}
                className={`relative py-2.5 sm:py-3 px-3 sm:px-6 rounded-md font-medium text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none ${
                  activeTab === "pretrip"
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <span className="relative z-10">
                  <span className="block sm:inline">Pretrip</span>
                  <span className="hidden xs:inline sm:inline"> Checkup</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("live")}
                className={`relative py-2.5 sm:py-3 px-3 sm:px-6 rounded-md font-medium text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none ${
                  activeTab === "live"
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <span className="relative z-10">
                  <span className="block sm:inline">Live</span>
                  <span className="hidden xs:inline sm:inline"> Assistance</span>
                </span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-32">
          {activeTab === "roadside" && <RoadsideAssistance />}
          {activeTab === "pretrip" && <PretripCheckup />}
          {activeTab === "live" && <LiveAssistance />}
        </div>
      </div>
    </div>
  )
}
