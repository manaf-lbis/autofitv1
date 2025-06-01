import { useState } from "react"
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
} from "lucide-react"

const Service = () => {
  const [userCount, setUserCount] = useState(0)

  return (
    <>
      {/* Services Section */}
      <section id="services-detail" className="pt-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100 rounded-full text-blue-700 text-sm font-semibold mb-8 shadow-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 }}
            >
              <Shield size={18} className="mr-2" />
              Professional Roadside Solutions
            </motion.div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-teal-600 to-purple-600 bg-clip-text text-transparent">
                Complete
              </span>
              <br />
              Roadside Partner
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Three comprehensive services designed to keep you safe, connected, and prepared for every journey ahead.
            </p>
          </motion.div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {[
              {
                title: "Emergency Assistance",
                subtitle: "24/7 Roadside Support",
                description: "Professional mechanics available around the clock for all your roadside emergencies.",
                icon: Phone,
                gradient: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
                textColor: "text-blue-600",
                features: ["Jump start service", "Tire change & repair", "Lockout assistance", "Fuel delivery"],
                highlight: "< 15 min response",
                badge: "Most Requested",
              },
              {
                title: "Video Diagnostics",
                subtitle: "Live Expert Consultation",
                description:
                  "Connect instantly with certified mechanics through HD video calls for real-time diagnosis.",
                icon: Video,
                gradient: "from-teal-500 to-teal-600",
                bgColor: "bg-teal-50",
                borderColor: "border-teal-200",
                textColor: "text-teal-600",
                features: [
                  "HD video diagnostics",
                  "Real-time troubleshooting",
                  "Step-by-step guidance",
                  "Expert consultation",
                ],
                highlight: "Instant connection",
                badge: "Most Popular",
              },
              {
                title: "Pre-Trip Inspection",
                subtitle: "Preventive Care",
                description: "Comprehensive vehicle inspections before your journey to prevent breakdowns.",
                icon: CheckCircle,
                gradient: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
                borderColor: "border-purple-200",
                textColor: "text-purple-600",
                features: [
                  "Comprehensive inspection",
                  "Safety assessment",
                  "Maintenance recommendations",
                  "Detailed reports",
                ],
                highlight: "Prevent issues",
                badge: "Recommended",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <motion.div
                  className={`relative ${service.bgColor} rounded-3xl p-8 border-2 ${service.borderColor} hover:border-opacity-60 transition-all duration-500 h-full group-hover:shadow-2xl`}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="absolute -top-3 left-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${service.textColor} bg-white border ${service.borderColor} shadow-sm`}
                    >
                      {service.badge}
                    </span>
                  </div>

                  <div className="mb-6">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <service.icon className="text-white" size={32} />
                    </motion.div>
                  </div>

                  <div className="mb-6">
                    <div className={`text-sm font-semibold ${service.textColor} mb-2`}>{service.subtitle}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>

                    <div
                      className={`inline-flex items-center px-4 py-2 ${service.bgColor} border ${service.borderColor} rounded-full`}
                    >
                      <Clock className={service.textColor} size={16} />
                      <span className={`ml-2 text-sm font-semibold ${service.textColor}`}>{service.highlight}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="text-green-600" size={12} />
                        </div>
                        <span className="text-gray-700 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    className={`w-full bg-gradient-to-r ${service.gradient} text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group/btn`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Get Started
                      <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={18} />
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Success Stories Section - IMPROVED */}
          <motion.div
            className="relative overflow-hidden rounded-3xl mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Modern layered background */}
            <div className="absolute inset-0">
              {/* Base gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>

              {/* Overlay gradients for depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-teal-500/20"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-purple-600/10 via-transparent to-blue-500/10"></div>

              {/* Mesh gradient overlay */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/30 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-teal-500/30 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Animated geometric shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Large floating orbs */}
              <motion.div
                className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full blur-xl"
                animate={{
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-br from-purple-500/15 to-blue-500/15 rounded-full blur-xl"
                animate={{
                  x: [0, -40, 0],
                  y: [0, 30, 0],
                  scale: [1, 0.9, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "50px 50px",
                  }}
                />
              </div>

              {/* Floating particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -50, 0],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 6 + Math.random() * 4,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 p-12 text-white">
              <div className="text-center mb-12">
                <motion.h3
                  className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-teal-100 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Real Impact, Real Results
                </motion.h3>
                <motion.p
                  className="text-xl text-gray-300 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Every number tells a story of drivers we've helped get back on the road safely
                </motion.p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  {
                    number: userCount.toLocaleString() + "+",
                    label: "Lives Touched",
                    icon: Users,
                    description: "Drivers helped nationwide",
                    color: "from-blue-400 to-cyan-400",
                  },
                  {
                    number: "99.9%",
                    label: "Success Rate",
                    icon: Zap,
                    description: "Problems resolved first time",
                    color: "from-teal-400 to-green-400",
                  },
                  {
                    number: "< 12min",
                    label: "Avg Response",
                    icon: Clock,
                    description: "Faster than industry standard",
                    color: "from-purple-400 to-pink-400",
                  },
                  {
                    number: "4.9★",
                    label: "Customer Love",
                    icon: Star,
                    description: "Rated by real customers",
                    color: "from-yellow-400 to-orange-400",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center group"
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    {/* Icon with modern glass effect */}
                    <motion.div
                      className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl backdrop-blur-sm border border-white/10 group-hover:shadow-3xl transition-all duration-300`}
                      whileHover={{ rotate: 5 }}
                      style={{
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <stat.icon className="text-white drop-shadow-lg" size={32} />
                    </motion.div>

                    {/* Animated number */}
                    <motion.div
                      className="text-4xl font-bold mb-2 bg-gradient-to-br from-white to-gray-200 bg-clip-text text-transparent"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.1 + 0.3,
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      {stat.number}
                    </motion.div>

                    <div className="text-lg font-semibold mb-1 text-gray-100">{stat.label}</div>
                    <div className="text-sm text-gray-400 opacity-90">{stat.description}</div>

                    {/* Animated underline with glow */}
                    <motion.div
                      className={`w-0 h-0.5 bg-gradient-to-r ${stat.color} mx-auto mt-2 group-hover:w-full transition-all duration-300 shadow-lg`}
                      initial={{ width: 0 }}
                      whileInView={{ width: "50%" }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      style={{
                        filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))",
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Bottom section with modern call to action */}
              <motion.div
                className="text-center mt-12 pt-8 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-lg text-gray-300 mb-6">Join thousands of satisfied customers who trust RoadEase</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transition-all backdrop-blur-sm border border-white/10"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    Get Started Today
                  </motion.button>
                  <motion.button
                    className="border-2 border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Success Stories
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Why Choose RoadEase */}
          {/* Why Choose RoadEase Section */}
          <motion.div
            className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Why Choose RoadEase?</h3>
              <p className="text-gray-600">Compare our comprehensive service offerings</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Instant Response",
                  description: "Get help in under 15 minutes with our optimized dispatch system",
                  icon: Zap,
                  color: "blue",
                },
                {
                  title: "Certified Experts",
                  description: "All mechanics are ASE certified with 5+ years of experience",
                  icon: Award,
                  color: "teal",
                },
                {
                  title: "Complete Coverage",
                  description: "Nationwide service network covering all major highways and cities",
                  icon: MapPin,
                  color: "purple",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 p-4 backdrop-blur-md bg-white/30 rounded-2xl border border-white/40"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className={`p-3 bg-${item.color}-100 rounded-xl`}>
                    <item.icon className={`text-${item.color}-600`} size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
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