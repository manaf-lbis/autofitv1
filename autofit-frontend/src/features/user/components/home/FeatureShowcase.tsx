import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Phone,
  CheckCircle,
  Video,
  MapPin,
  Clock,
  Shield,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import allDayImg from '@/assets/userSide/serviceSection/allDay.png'
import liveAssistance from '@/assets/userSide/serviceSection/liveAssistance.png'
import preTripImg from '@/assets/userSide/serviceSection/preTripImg.png'
import ontime from '@/assets/userSide/serviceSection/ontime.png'
import realTimeTracking from '@/assets/userSide/serviceSection/realTimeTracking.png'
import trust from '@/assets/userSide/serviceSection/trust.png'


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
      bg: "bg-blue-600",
      light: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
      hover: "hover:bg-blue-700",
      ring: "ring-blue-500/20",
    },
    emerald: {
      bg: "bg-emerald-600",
      light: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
      hover: "hover:bg-emerald-700",
      ring: "ring-emerald-500/20",
    },
    violet: {
      bg: "bg-violet-600",
      light: "bg-violet-50",
      text: "text-violet-600",
      border: "border-violet-200",
      hover: "hover:bg-violet-700",
      ring: "ring-violet-500/20",
    },
    orange: {
      bg: "bg-orange-600",
      light: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
      hover: "hover:bg-orange-700",
      ring: "ring-orange-500/20",
    },
    cyan: {
      bg: "bg-cyan-600",
      light: "bg-cyan-50",
      text: "text-cyan-600",
      border: "border-cyan-200",
      hover: "hover:bg-cyan-700",
      ring: "ring-cyan-500/20",
    },
    green: {
      bg: "bg-green-600",
      light: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
      hover: "hover:bg-green-700",
      ring: "ring-green-500/20",
    },
  }
  return colors[color as keyof typeof colors] || colors.blue
}

const FeatureShowcase = () => {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isAutoPlay] = useState(true)
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-play functionality with hover pause
  React.useEffect(() => {
    if (!isAutoPlay || isPaused) return

    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isAutoPlay, isPaused])

  const currentColors = getColorClasses(features[currentFeature].color)

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length)
  }

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length)
  }

  return (
    <section className="min-h-screen py-8 md:py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-full mb-6 shadow-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Zap size={16} className="mr-2 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Premium Features</span>
          </motion.div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-balance leading-tight">
            Everything You Need in{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                One App
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto text-pretty leading-relaxed">
            Experience the future of roadside assistance with our cutting-edge features designed for reliability and
            peace of mind
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 xl:gap-16 items-center">
          {/* Left - Enhanced Content */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <div className="hidden md:block">
                  <Card className="border-0 shadow-2xl bg-white relative overflow-hidden backdrop-blur-sm">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentColors.bg}`} />
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6 mb-8">
                        <motion.div
                          className={`w-16 h-16 ${currentColors.light} rounded-2xl flex items-center justify-center shadow-lg ring-4 ${currentColors.ring}`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {React.createElement(features[currentFeature].icon, {
                            className: currentColors.text,
                            size: 28,
                          })}
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                            {features[currentFeature].title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Star className="text-yellow-400 fill-current" size={16} />
                            <span className={`text-sm font-bold ${currentColors.text}`}>
                              {features[currentFeature].stats}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
                        {features[currentFeature].description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {features[currentFeature].benefits.map((benefit, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-white transition-all cursor-pointer group border border-gray-100 hover:border-gray-200 hover:shadow-md"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            onHoverStart={() => setHoveredBenefit(index)}
                            onHoverEnd={() => setHoveredBenefit(null)}
                          >
                            <motion.div
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                                hoveredBenefit === index ? currentColors.bg : "bg-green-100"
                              }`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Check
                                className={`transition-all duration-300 ${
                                  hoveredBenefit === index ? "text-white" : "text-green-600"
                                }`}
                                size={14}
                              />
                            </motion.div>
                            <span className="text-sm font-medium text-gray-800">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={prevFeature}
                            className="h-12 w-12 p-0 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all"
                          >
                            <ChevronLeft size={18} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={nextFeature}
                            className="h-12 w-12 p-0 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all"
                          >
                            <ChevronRight size={18} />
                          </Button>
                        </div>

                        <div className="text-sm font-semibold text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                          {currentFeature + 1} / {features.length}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="block md:hidden">
                  <div className="relative">
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentColors.bg} rounded-full`}
                    />

                    <div className="pt-6">
                      <div className="flex items-start gap-4 mb-6">
                        <motion.div
                          className={`w-14 h-14 ${currentColors.light} rounded-2xl flex items-center justify-center shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {React.createElement(features[currentFeature].icon, {
                            className: currentColors.text,
                            size: 24,
                          })}
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                            {features[currentFeature].title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Star className="text-yellow-400 fill-current" size={14} />
                            <span className={`text-xs font-bold ${currentColors.text}`}>
                              {features[currentFeature].stats}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-6">
                        {features[currentFeature].description}
                      </p>

                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {features[currentFeature].benefits.map((benefit, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <Check className="text-green-600" size={12} />
                            </div>
                            <span className="text-sm font-medium text-gray-800">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={prevFeature}
                            className="h-10 w-10 p-0 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-xl shadow-sm"
                          >
                            <ChevronLeft size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={nextFeature}
                            className="h-10 w-10 p-0 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-xl shadow-sm"
                          >
                            <ChevronRight size={16} />
                          </Button>
                        </div>

                        <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                          {currentFeature + 1} / {features.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-8">
              {features.map((feature, index) => {
                const colors = getColorClasses(feature.color)
                return (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentFeature ? `${colors.bg} w-8 shadow-md` : "bg-gray-300 hover:bg-gray-400 w-2"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                )
              })}
            </div>
          </motion.div>

          {/* Right - Enhanced Image */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="relative group"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-100 ring-1 ring-gray-200">
                  <img
                    src={
                      features[currentFeature].image ||
                      "/placeholder.svg?height=400&width=600&query=modern roadside assistance" 
                    }
                    alt={features[currentFeature].title}
                    className="w-full h-64 md:h-80 lg:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />

                  <motion.div
                    className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-white/20"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-gray-700">Live</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className={`absolute bottom-6 left-6 ${currentColors.bg} text-white rounded-2xl p-4 shadow-xl`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {React.createElement(features[currentFeature].icon, {
                      size: 24,
                    })}
                  </motion.div>

                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/10 rounded-b-3xl">
                    <motion.div
                      className={`h-full ${currentColors.bg} shadow-sm rounded-b-3xl`}
                      initial={{ width: "0%" }}
                      animate={{ width: isAutoPlay && !isPaused ? "100%" : "0%" }}
                      transition={{ duration: 4, ease: "linear" }}
                      key={`${currentFeature}-${isAutoPlay}-${isPaused}`}
                    />
                  </div>
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
