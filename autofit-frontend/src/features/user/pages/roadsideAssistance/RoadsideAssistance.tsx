import {
  Car,
  Battery,
  Key,
  Thermometer,
  AlertTriangle,
  Truck,
  Zap,
  HelpCircle,
  ArrowRight,
  Clock,
  Shield,
  Star,
  MessageCircle,
  MapPin,
} from "lucide-react"
import { Link } from "react-router-dom"

export default function RoadsideAssistance() {
  return (
    <div className="mt-3 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg">
            <Shield className="w-4 h-4" />
            24/7 Emergency Assistance Available
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Emergency
            <span className="text-blue-600"> Roadside Services</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12">
            Professional roadside assistance when you need it most. Fast response times, expert technicians, and
            transparent pricing you can trust.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-xl">
              <div className="text-3xl font-bold text-blue-600 mb-1">15min</div>
              <div className="text-sm text-gray-700 font-medium">Average Response</div>
            </div>
            <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-xl">
              <div className="text-3xl font-bold text-green-600 mb-1">24/7</div>
              <div className="text-sm text-gray-700 font-medium">Always Available</div>
            </div>
            <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-3xl font-bold text-yellow-600">4.9</span>
              </div>
              <div className="text-sm text-gray-700 font-medium">Customer Rating</div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <Link to={`/user/roadside-assistance/mechanic-booking`} key={service.id} className="group">
              <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:bg-white/35 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                {/* Icon */}
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.bgColor} group-hover:scale-110 transition-transform duration-300 shadow-lg backdrop-blur-sm border border-white/20`}
                  >
                    <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{service.description}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">{service.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                    <span className="text-sm">Get Help</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Custom Issue Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <Link to="/services/custom/request" className="group block">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-12 text-center hover:bg-white/30 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-2xl">
              <div className="w-20 h-20 bg-purple-500/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <HelpCircle className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                Facing a different issue?
              </h3>
              <p className="text-gray-700 mb-8 max-w-md mx-auto leading-relaxed">
                Describe your specific emergency and we'll connect you with the right specialist immediately
              </p>
              <div className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg">
                <span>Get Custom Help</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Live Chat */}
          <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Chat Support</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Get instant help from our support team. Available 24/7 for immediate assistance and guidance.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg flex items-center gap-2 mx-auto">
              <MessageCircle className="w-4 h-4" />
              Start Chat
            </button>
          </div>

          {/* Track Service */}
          <div className="bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-green-500/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Your Service</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Real-time tracking of your technician's location and estimated arrival time with live updates.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg flex items-center gap-2 mx-auto">
              <MapPin className="w-4 h-4" />
              Track Service
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const services = [
  {
    id: "flat-tire",
    name: "Flat Tire Repair",
    description: "Professional tire replacement and repair service to get you moving safely again",
    icon: Car,
    bgColor: "bg-blue-500/20",
    iconColor: "text-blue-600",
    responseTime: "15-20 min",
  },
  {
    id: "jump-start",
    name: "Jump Start Service",
    description: "Quick battery jump start service to get your engine running when your battery dies",
    icon: Battery,
    bgColor: "bg-green-500/20",
    iconColor: "text-green-600",
    responseTime: "10-15 min",
  },
  {
    id: "locked-out",
    name: "Vehicle Lockout",
    description: "Safe vehicle entry without damage using professional locksmith tools and techniques",
    icon: Key,
    bgColor: "bg-yellow-500/20",
    iconColor: "text-yellow-600",
    responseTime: "15-25 min",
  },
  {
    id: "overheating-engine",
    name: "Engine Overheating",
    description: "Emergency cooling system service and safe towing if required for engine protection",
    icon: Thermometer,
    bgColor: "bg-red-500/20",
    iconColor: "text-red-600",
    responseTime: "20-30 min",
  },
  {
    id: "brake-failure",
    name: "Brake Emergency",
    description: "Immediate safety assessment and emergency towing to repair facility for brake issues",
    icon: AlertTriangle,
    bgColor: "bg-orange-500/20",
    iconColor: "text-orange-600",
    responseTime: "10-15 min",
  },
  {
    id: "towing-service",
    name: "Towing Service",
    description: "Professional towing to your destination with fully insured and secure transport",
    icon: Truck,
    bgColor: "bg-purple-500/20",
    iconColor: "text-purple-600",
    responseTime: "20-35 min",
  },
  {
    id: "electrical-issues",
    name: "Electrical Problems",
    description: "Comprehensive electrical system diagnosis and on-site repairs for various issues",
    icon: Zap,
    bgColor: "bg-indigo-500/20",
    iconColor: "text-indigo-600",
    responseTime: "25-40 min",
  },
]
