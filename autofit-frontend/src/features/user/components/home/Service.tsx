import { motion } from "framer-motion"
import {
  Shield,
  Phone,
  Video,
  CheckCircle,
  Clock,
  Check,
  ArrowRight,
  Users,
  Zap,
  Star,
  Award,
  MapPin,
  TrendingUp,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const Service = () => {
  const navigate = useNavigate()

  return (
    <>
      {/* Services Section */}
      <section id="services-detail" className="pt-16 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Shield size={16} className="mr-2" />
              Professional Roadside Solutions
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Complete</span>
              <br />
              Roadside Partner
            </h2>

            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Three comprehensive services designed to keep you safe, connected, and prepared for every journey ahead.
            </p>
          </motion.div>

          {/* Service Cards - Improved hover effects and scaling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              {
                title: "Emergency Assistance",
                subtitle: "24/7 Roadside Support",
                description: "Professional mechanics available around the clock for all your roadside emergencies.",
                icon: Phone,
                gradient: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-100",
                textColor: "text-blue-600",
                features: ["Jump start service", "Tire change & repair", "Lockout assistance", "Fuel delivery"],
                highlight: "< 15 min response",
                badge: "Most Requested",
                href: "roadside-assistance",
              },
              {
                title: "Video Diagnostics",
                subtitle: "Live Expert Consultation",
                description:
                  "Connect instantly with certified mechanics through HD video calls for real-time diagnosis.",
                icon: Video,
                gradient: "from-teal-500 to-teal-600",
                bgColor: "bg-teal-50",
                borderColor: "border-teal-100",
                textColor: "text-teal-600",
                features: [
                  "HD video diagnostics",
                  "Real-time troubleshooting",
                  "Step-by-step guidance",
                  "Expert consultation",
                ],
                highlight: "Instant connection",
                badge: "Most Popular",
                href: "/user/live-assistance/booking",
              },
              {
                title: "Pre-Trip Inspection",
                subtitle: "Preventive Care",
                description: "Comprehensive vehicle inspections before your journey to prevent breakdowns.",
                icon: CheckCircle,
                gradient: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
                borderColor: "border-purple-100",
                textColor: "text-purple-600",
                features: [
                  "Comprehensive inspection",
                  "Safety assessment",
                  "Maintenance recommendations",
                  "Detailed reports",
                ],
                highlight: "Prevent issues",
                badge: "Recommended",
                href: "pretrip-checkup/plans",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <motion.div
                  className={`relative ${service.bgColor} rounded-2xl p-6 border ${service.borderColor} transition-all duration-500 ease-out h-full hover:shadow-xl`}
                  whileHover={{
                    y: -6,
                    scale: 1.005,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  style={{ transformOrigin: "center" }}
                >
                  <div className="absolute -top-2 left-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${service.textColor} bg-white border ${service.borderColor} shadow-sm`}
                    >
                      {service.badge}
                    </span>
                  </div>

                  <div className="mb-5">
                    <motion.div
                      className={`w-14 h-14 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center shadow-md`}
                      whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.2, ease: "easeOut" },
                      }}
                    >
                      <service.icon className="text-white" size={22} />
                    </motion.div>
                  </div>

                  <div className="mb-5">
                    <div className={`text-sm font-medium ${service.textColor} mb-2`}>{service.subtitle}</div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{service.description}</p>

                    <div
                      className={`inline-flex items-center px-3 py-1.5 ${service.bgColor} border ${service.borderColor} rounded-full`}
                    >
                      <Clock className={service.textColor} size={12} />
                      <span className={`ml-2 text-xs font-medium ${service.textColor}`}>{service.highlight}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="text-green-600" size={10} />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    className={`relative w-full bg-gradient-to-r ${service.gradient} text-white py-3 px-4 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group`}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(service.href)}
                  >
                    {/* Shining effect overlay */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>

                    <span className="relative flex items-center justify-center gap-2">
                      Get Started
                      <ArrowRight className="group-hover:translate-x-0.5 transition-transform duration-200" size={14} />
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <motion.h3
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Trusted by Thousands
              </motion.h3>
              <motion.p
                className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Real numbers from real customers who trust RoadEase for their roadside needs
              </motion.p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  number: "50,000+",
                  label: "Happy Customers",
                  icon: Users,
                  description: "Drivers helped nationwide",
                  color: "blue",
                },
                {
                  number: "99.8%",
                  label: "Success Rate",
                  icon: TrendingUp,
                  description: "Issues resolved successfully",
                  color: "teal",
                },
                {
                  number: "12 min",
                  label: "Avg Response",
                  icon: Clock,
                  description: "Average response time",
                  color: "purple",
                },
                {
                  number: "4.9★",
                  label: "Customer Rating",
                  icon: Star,
                  description: "Based on 10k+ reviews",
                  color: "amber",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className={`w-16 h-16 bg-${stat.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200`}
                  >
                    <stat.icon className={`text-${stat.color}-600`} size={24} />
                  </motion.div>

                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm md:text-base font-medium text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-xs md:text-sm text-gray-500">{stat.description}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-center mt-10 pt-8 border-t border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-gray-600 mb-6">Ready to experience the RoadEase difference?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="relative bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                  <span className="relative">Get Started Today</span>
                </motion.button>
                <motion.button
                  className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-8 border border-blue-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Why Choose RoadEase?</h3>
              <p className="text-sm md:text-base text-gray-600">What sets us apart from the competition</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Lightning Fast",
                  description: "Average 12-minute response time with GPS-optimized dispatch",
                  icon: Zap,
                  color: "blue",
                },
                {
                  title: "Certified Experts",
                  description: "ASE-certified mechanics with 5+ years of hands-on experience",
                  icon: Award,
                  color: "teal",
                },
                {
                  title: "Complete Coverage",
                  description: "Nationwide network covering all major highways and cities",
                  icon: MapPin,
                  color: "purple",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300"
                  whileHover={{
                    y: -4,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                >
                  <div className={`w-12 h-12 bg-${item.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                    <item.icon className={`text-${item.color}-600`} size={20} />
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Service
