import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, CheckCircle, Video, MapPin, Clock, Shield, Check } from "lucide-react"
import allDayImg from '@/assets/userSide/serviceSection/allDay.png'
import liveAssistance from '@/assets/userSide/serviceSection/liveAssistance.png'
import preTripImg from '@/assets/userSide/serviceSection/preTripImg.png'
import ontime from '@/assets/userSide/serviceSection/ontime.png'
import realTimeTracking from '@/assets/userSide/serviceSection/realTimeTracking.png'
import trust from '@/assets/userSide/serviceSection/trust.png'


// Feature showcase data
const features = [
  {
    title: "24/7 Roadside Assistance",
    description: "Professional mechanics available around the clock for all your emergency needs.",
    image: allDayImg,
    icon: Phone,
    stats: "Available 24/7",
    color: "blue",
    benefits: ["Instant response", "Certified mechanics", "All vehicle types", "Emergency priority"],
  },
  {
    title: "Live Video Support",
    description: "Connect with certified mechanics through HD video calls for real-time diagnosis.",
    image: liveAssistance,
    icon: Video,
    stats: "HD Video Quality",
    color: "emerald",
    benefits: ["Real-time diagnosis", "Expert guidance", "Save time & money", "Professional advice"],
  },
  {
    title: "Pre-Trip Checkup",
    description: "Schedule comprehensive vehicle inspections before your journey to prevent breakdowns.",
    image: preTripImg,
    icon: CheckCircle,
    stats: "Preventive Care",
    color: "violet",
    benefits: ["Prevent breakdowns", "Detailed reports", "Expert recommendations", "Peace of mind"],
  },
  {
    title: "Quick Response",
    description: "Get assistance in under 15 minutes with our optimized dispatch system.",
    image: ontime,
    icon: Clock,
    stats: "< 15 Minutes",
    color: "orange",
    benefits: ["Guaranteed response", "Optimized dispatch", "Strategic placement", "Industry leading"],
  },
  {
    title: "Real-time Tracking",
    description: "Track your mechanic's location with precise GPS coordinates and live ETA updates.",
    image: realTimeTracking,
    icon: MapPin,
    stats: "GPS Tracking",
    color: "cyan",
    benefits: ["Live GPS tracking", "ETA updates", "Direct communication", "Service transparency"],
  },
  {
    title: "Trusted Service",
    description: "Join over 50,000 satisfied customers who trust RoadEase for reliable assistance.",
    image: trust,
    icon: Shield,
    stats: "50K+ Users",
    color: "green",
    benefits: ["50K+ customers", "99.9% uptime", "4.9-star rating", "Proven reliability"],
  },
]

const getColorClasses = (color: string) => {
  const colors = {
    blue: {
      bg: "bg-blue-500",
      light: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
      lightBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    emerald: {
      bg: "bg-emerald-500",
      light: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
      lightBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    violet: {
      bg: "bg-violet-500",
      light: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-200",
      lightBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    orange: {
      bg: "bg-orange-500",
      light: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
      lightBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    cyan: {
      bg: "bg-cyan-500",
      light: "bg-cyan-50",
      text: "text-cyan-600",
      border: "border-cyan-200",
      lightBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    green: {
      bg: "bg-green-500",
      light: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
      lightBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  }
  return colors[color as keyof typeof colors] || colors.blue
}

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

const FeatureShowcase = () => {
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const currentColors = getColorClasses(features[currentFeature].color)

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Glass Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-white/20 backdrop-blur-3xl rounded-full border border-white/30"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 backdrop-blur-3xl rounded-full border border-blue-200/30"
          animate={{
            x: [0, -40, 0],
            y: [0, 25, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-white/40 backdrop-blur-xl rounded-full border border-white/60 shadow-lg mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Shield size={18} className="mr-2 text-blue-600" />
            <span className="text-sm font-semibold text-slate-700">Feature Showcase</span>
          </motion.div>

          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Everything You Need in <span className="text-blue-600">One App</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover powerful features designed to make roadside assistance seamless
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/70 shadow-xl"
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className={`w-16 h-16 ${currentColors.lightBg} rounded-2xl flex items-center justify-center shadow-lg border border-white/50`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {React.createElement(features[currentFeature].icon, {
                      className: currentColors.iconColor,
                      size: 28,
                    })}
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">{features[currentFeature].title}</h3>
                    <span
                      className={`text-sm font-medium ${currentColors.text} px-3 py-1 ${currentColors.light} rounded-full inline-block mt-1`}
                    >
                      {features[currentFeature].stats}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg text-gray-600 leading-relaxed mb-6">{features[currentFeature].description}</p>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-3">
                  {features[currentFeature].benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/60"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="text-green-600" size={12} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Feature Navigation */}
            <div className="flex gap-3 pt-4">
              {features.map((feature, index) => {
                const colors = getColorClasses(feature.color)
                return (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`p-4 rounded-xl transition-all backdrop-blur-xl border ${
                      index === currentFeature
                        ? `${colors.lightBg} ${colors.iconColor} border-white/60 shadow-lg`
                        : "bg-white/40 text-gray-600 hover:bg-white/60 border-white/50"
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {React.createElement(feature.icon, { size: 20 })}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="relative group"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/50">
                  <img
                    src={features[currentFeature].image || "/placeholder.svg"}
                    alt={features[currentFeature].title}
                    className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Floating Icon */}
                  <motion.div
                    className="absolute top-6 right-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-white/60 shadow-xl"
                    variants={floatingAnimation}
                    animate="animate"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {React.createElement(features[currentFeature].icon, {
                      className: currentColors.iconColor,
                      size: 24,
                    })}
                  </motion.div>

                  {/* Floating Stats Badge */}
                  <motion.div
                    className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-xl rounded-xl px-4 py-3 border border-white/60 shadow-xl"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${currentColors.lightBg} rounded-lg flex items-center justify-center`}>
                        {React.createElement(features[currentFeature].icon, {
                          className: currentColors.iconColor,
                          size: 16,
                        })}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{features[currentFeature].stats}</div>
                        <div className="text-xs text-gray-600">Active Now</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Additional Floating Elements */}
                  <motion.div
                    className="absolute top-1/3 -left-4 bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-white/60 shadow-lg"
                    animate={{
                      x: [0, 10, 0],
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-gray-700">Online</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-1/3 -right-4 bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-white/60 shadow-lg"
                    animate={{
                      x: [0, -10, 0],
                      y: [0, 5, 0],
                    }}
                    transition={{
                      duration: 7,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 3,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className={currentColors.iconColor} size={14} />
                      <span className="text-xs font-medium text-gray-700">Fast</span>
                    </div>
                  </motion.div>
                </div>

                {/* Progress Indicator */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {features.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        index === currentFeature ? `w-8 ${currentColors.bg}` : "w-2 bg-gray-300"
                      }`}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeatureShowcase

