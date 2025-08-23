import { Car, Battery, Key, Thermometer, AlertTriangle, Truck, Zap, HelpCircle, ArrowRight, Clock, Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import StatsCards from "../../components/roadsideAssistance/StatCards";

export default function RoadsideAssistance() {
  const navigate = useNavigate();
  const services = [
    { id: "flat-tire", name: "Flat Tire Repair", description: "Professional tire replacement and repair service to get you moving safely again", icon: Car, bgColor: "bg-blue-500/20", iconColor: "text-blue-600", responseTime: "15-20 min" },
    { id: "jump-start", name: "Jump Start Service", description: "Quick battery jump start service to get your engine running when your battery dies", icon: Battery, bgColor: "bg-green-500/20", iconColor: "text-green-600", responseTime: "10-15 min" },
    { id: "locked-out", name: "Vehicle Lockout", description: "Safe vehicle entry without damage using professional locksmith tools and techniques", icon: Key, bgColor: "bg-yellow-500/20", iconColor: "text-yellow-600", responseTime: "15-25 min" },
    { id: "overheating-engine", name: "Engine Overheating", description: "Emergency cooling system service and safe towing if required for engine protection", icon: Thermometer, bgColor: "bg-red-500/20", iconColor: "text-red-600", responseTime: "20-30 min" },
    { id: "brake-failure", name: "Brake Emergency", description: "Immediate safety assessment and emergency towing to repair facility for brake issues", icon: AlertTriangle, bgColor: "bg-orange-500/20", iconColor: "text-orange-600", responseTime: "10-15 min" },
    { id: "towing-service", name: "Towing Service", description: "Professional towing to your destination with fully insured and secure transport", icon: Truck, bgColor: "bg-purple-500/20", iconColor: "text-purple-600", responseTime: "20-35 min" },
    { id: "electrical-issues", name: "Electrical Problems", description: "Comprehensive electrical system diagnosis and on-site repairs for various issues", icon: Zap, bgColor: "bg-indigo-500/20", iconColor: "text-indigo-600", responseTime: "25-40 min" },
  ];

  return (
    <div className="min-h-screen mt-14 bg-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-20">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/30 backdrop-blur-md border border-white/40 text-blue-800 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg text-xs sm:text-sm font-semibold mb-4 sm:mb-6 lg:mb-8 shadow-sm">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">24/7 Emergency Available</span>
            <span className="xs:hidden">24/7 Available</span>
          </div>
          
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight px-2">
            Emergency
            <span className="text-blue-600 block xs:inline"> Roadside Services</span>
          </h1>
          
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 lg:mb-12 px-2 sm:px-4">
            Professional roadside assistance when you need it most. Fast response times, expert technicians, and
            transparent pricing you can trust.
          </p>

          {/* Stats */}
          <StatsCards />

        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 lg:mb-16 px-2 sm:px-4">
          {services.map((service) => (
            <div key={service.id} className="group cursor-pointer" onClick={() => navigate('/user/roadside-assistance/mechanic-booking')}>
              <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:bg-white/35 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 h-full flex flex-col">
                {/* Icon */}
                <div className="mb-3 sm:mb-4 lg:mb-6">
                  <div
                    className={`w-10 sm:w-12 lg:w-14 xl:w-16 h-10 sm:h-12 lg:h-14 xl:h-16 rounded-lg sm:rounded-xl flex items-center justify-center ${service.bgColor} group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300 shadow-sm backdrop-blur-sm border border-white/20`}
                  >
                    <service.icon className={`w-5 sm:w-6 lg:w-7 xl:w-8 h-5 sm:h-6 lg:h-7 xl:h-8 ${service.iconColor}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow mb-3 sm:mb-4 lg:mb-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-sm line-clamp-3 sm:line-clamp-none">{service.description}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/20">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">{service.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-blue-600 font-semibold group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                    <span className="text-xs sm:text-sm whitespace-nowrap">Get Help</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Custom Issue Card */}
          <div className="group cursor-pointer" onClick={() => navigate('/user/roadside-assistance/mechanic-booking')}>
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md hover:bg-white/30 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 h-full flex flex-col items-center justify-center text-center">
              <div className="w-10 sm:w-12 lg:w-14 xl:w-16 h-10 sm:h-12 lg:h-14 xl:h-16 bg-purple-500/20 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <HelpCircle className="w-5 sm:w-6 lg:w-7 xl:w-8 h-5 sm:h-6 lg:h-7 xl:h-8 text-purple-600" />
              </div>
              <div className="flex-grow mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-purple-600 transition-colors">
                  Different Issue?
                </h3>
                <p className="text-gray-700 leading-relaxed text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                  Describe your specific emergency and we'll connect you with the right specialist
                </p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-purple-600 font-semibold group-hover:gap-2 sm:group-hover:gap-3 transition-all pt-3 border-t border-white/20 w-full justify-center">
                <span className="text-xs sm:text-sm whitespace-nowrap">Get Custom Help</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


