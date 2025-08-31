import { Car, CheckCircle, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom"

const services = [
  {
    id: "roadside",
    subtitle: "24/7 Roadside Support",
    title: "Emergency Assistance",
    description:
      "Stuck on the road with car trouble? Our professional mechanics provide immediate roadside assistance to get you back on track safely and quickly.",
    icon: Car,
    iconColor: "text-white",
    iconBg: "bg-blue-500",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    cardBg: "bg-blue-50/30",
    borderColor: "border-blue-200/50",
    href : '/roadside-assistance'
  },
  {
    id: "video",
    subtitle: "Live Expert Consultation",
    title: "Video Diagnostics",
    description:
      "In a remote location without access to a mechanic? Connect with our certified professionals via video call for step-by-step DIY guidance.",
    icon: Video,
    iconColor: "text-white",
    iconBg: "bg-teal-500",
    buttonColor: "bg-teal-600 hover:bg-teal-700",
    cardBg: "bg-teal-50/30",
    borderColor: "border-teal-200/50",
    href : '/user/live-assistance/booking'
  },
  {
    id: "pretrip",
    subtitle: "Preventive Care",
    title: "Pre-Trip Inspection",
    description:
      "Planning a long journey? Our comprehensive pre-trip inspection ensures your vehicle is road-ready and safe for your upcoming adventure.",
    icon: CheckCircle,
    iconColor: "text-white",
    iconBg: "bg-purple-500",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    cardBg: "bg-purple-50/30",
    borderColor: "border-purple-200/50",
    href : '/pretrip-checkup/plans'
  },
];

export default function ServicesPage() {
  const navigate = useNavigate()

  return (
    <>
    <div className="min-h-screen mt-10 bg-gradient-to-br from-gray-100 to-gray-200 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */} 
         <div className="text-center mb-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight">
              Professional
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Automotive Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
              Expert solutions for every automotive challenge, delivered with precision and care
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon

            return (
              <div
                key={service.id}
                className={`relative ${service.cardBg} ${service.borderColor} border-2 rounded-3xl p-1 shadow-lg hover:shadow-xl transition-all duration-300`}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <Card
                  className="bg-white border-0 rounded-[20px] overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300 h-full"
                  onClick={() => navigate(service.href)}
                >
                  <CardContent className="p-6 sm:p-8 h-full flex flex-col">
                    {/* Icon */}
                    <div className="mb-6 sm:mb-8">
                      <div
                        className={`inline-flex p-3 sm:p-4 rounded-2xl ${service.iconBg} shadow-md group-hover:scale-105 transition-transform duration-300`}
                      >
                        <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${service.iconColor}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow mb-6 sm:mb-8">
                      <p className="text-sm sm:text-base font-medium text-gray-500 mb-2 sm:mb-3">{service.subtitle}</p>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{service.description}</p>
                    </div>

                    {/* Button */}
                    <Button
                      className={`w-full ${service.buttonColor} text-white font-semibold py-3 sm:py-4 px-6 rounded-xl text-sm sm:text-base transition-all duration-200 group-hover:scale-105`}
                    >
                      Book This Service
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Bottom Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Ready to Get Started?</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our certified mechanics are standing by to provide you with exceptional automotive care. Choose your
              service and experience the difference professional expertise makes.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
