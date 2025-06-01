import React from "react"
import { useEffect, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Play,
  Shield,
  Video,
  MapPin,
  Star,
  Users,
  Clock,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import livetrackingImg from '@/assets/userSide/hero/realtimeTracking.png'
import roadsideAssImg  from '@/assets/userSide/hero/workigMechHero.png'
import realTimeAss from '@/assets/userSide/hero/raltimeAssistance.png'

const heroSlides = [
  {
    title: "Emergency Roadside Assistance",
    subtitle: "24/7 Professional Help",
    description:
      "Get instant help from certified mechanics available around the clock. Fast response, reliable service, and complete peace of mind.",
    image: roadsideAssImg,
    accent: "blue",
    icon: Shield,
  },
  {
    title: "Live Video Diagnostics",
    subtitle: "Expert Mechanics Online",
    description:
      "Connect instantly with certified professionals through HD video calls for real-time diagnosis and step-by-step guidance.",
    image: realTimeAss,
    accent: "emerald",
    icon: Video,
  },
  {
    title: "Real-time GPS Tracking",
    subtitle: "Know Where Help Is",
    description:
      "Track your assigned mechanic in real-time with precise GPS location and live ETA updates throughout the entire service.",
    image: livetrackingImg,
    accent: "violet",
    icon: MapPin,
  },
]

const stats = [
  { number: "50K+", label: "Happy Customers", icon: Users },
  { number: "99.9%", label: "Uptime", icon: Zap },
  { number: "< 15min", label: "Response Time", icon: Clock },
  { number: "4.9", label: "App Rating", icon: Star },
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const slideInterval = useRef<number | null>(null);

  const currentSlideData = heroSlides[currentSlide]

  // Auto-advance slides
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current)
      }
    }
  }, [])

  // Animated counter
  useEffect(() => {
    const timer = setInterval(() => {
      setUserCount((prev) => (prev < 50000 ? prev + 1000 : 50000))
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [])

  const getAccentColors = (accent: string) => {
    switch (accent) {
      case "blue":
        return {
          primary: "bg-blue-600",
          hover: "hover:bg-blue-700",
          text: "text-blue-600",
          light: "bg-blue-50",
          border: "border-blue-200",
        }
      case "emerald":
        return {
          primary: "bg-emerald-600",
          hover: "hover:bg-emerald-700",
          text: "text-emerald-600",
          light: "bg-emerald-50",
          border: "border-emerald-200",
        }
      case "violet":
        return {
          primary: "bg-violet-600",
          hover: "hover:bg-violet-700",
          text: "text-violet-600",
          light: "bg-violet-50",
          border: "border-violet-200",
        }
      default:
        return {
          primary: "bg-blue-600",
          hover: "hover:bg-blue-700",
          text: "text-blue-600",
          light: "bg-blue-50",
          border: "border-blue-200",
        }
    }
  }

  const colors = getAccentColors(currentSlideData.accent)

  return (
    <section className="relative min-h-screen flex items-center bg-slate-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/50" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating Glass Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-80 h-80 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Glass Badge */}
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-700">Available 24/7</span>
              <div className="w-1 h-1 bg-slate-400 rounded-full" />
              <span className="text-sm text-slate-600">{userCount.toLocaleString()}+ served</span>
            </motion.div>

            {/* Title */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                    <span className={colors.text}>{currentSlideData.title.split(" ")[0]}</span>
                    <br />
                    <span className="text-slate-800">{currentSlideData.title.split(" ").slice(1).join(" ")}</span>
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed max-w-xl">{currentSlideData.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.button
                className={`group ${colors.primary} ${colors.hover} text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Help Now
                  <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                </span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                className="group bg-white/30 backdrop-blur-xl hover:bg-white/40 text-slate-700 px-8 py-4 rounded-2xl font-semibold text-lg border border-white/40 hover:border-white/60 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Play size={18} className="group-hover:scale-110 transition-transform duration-300" />
                  Watch Demo
                </span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {/* Stats Header */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Trusted by thousands</h3>
                <p className="text-sm text-slate-600">Real-time performance metrics</p>
              </div>

              {/* Stats Grid - Fixed Desktop Alignment */}
              <div className="space-y-6">
                {/* Main Stats - Better Desktop Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="group relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      {/* Glass Card */}
                      <div className="bg-white/30 backdrop-blur-xl rounded-xl p-4 border border-white/40 shadow-lg hover:bg-white/40 hover:shadow-xl transition-all duration-300 h-full min-h-[100px] flex flex-col justify-between">
                        {/* Icon Container */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/70 transition-all duration-300">
                            {React.createElement(stat.icon, {
                              className: "text-slate-700 group-hover:scale-110 transition-transform duration-300",
                              size: 18,
                            })}
                          </div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-60" />
                        </div>

                        {/* Stats Content */}
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors duration-300">
                            {stat.number}
                          </div>
                          <div className="text-sm text-slate-600 font-medium leading-tight">{stat.label}</div>
                        </div>

                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Info Cards - Better Spacing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <motion.div
                    className="bg-white/25 backdrop-blur-xl rounded-xl p-4 border border-white/40 shadow-lg hover:bg-white/35 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Users className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-700">{userCount.toLocaleString()}+</div>
                        <div className="text-xs text-slate-600 font-medium">Users Helped Today</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="bg-white/25 backdrop-blur-xl rounded-xl p-4 border border-white/40 shadow-lg hover:bg-white/35 transition-all duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <MapPin className="text-emerald-600" size={16} />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-emerald-700">2.5M+</div>
                        <div className="text-xs text-slate-600 font-medium">Miles Covered</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative group">
              {/* Main Image Container - Improved Effect */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative"
                  >
                    <img
                      src={currentSlideData.image || "/placeholder.svg"}
                      alt={currentSlideData.title}
                      className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Subtle overlay instead of glassmorphism */}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-500" />

                    {/* Elegant border glow effect */}
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 group-hover:ring-white/40 transition-all duration-500" />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft size={20} className="text-slate-700" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight size={20} className="text-slate-700" />
                  </button>
                </div>
              </div>

              {/* Floating Status Card */}
              <motion.div
                className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-xl"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-3">
                  {React.createElement(currentSlideData.icon, {
                    className: colors.text,
                    size: 20,
                  })}
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{currentSlideData.subtitle}</div>
                    <div className="text-xs text-slate-600">Active Now</div>
                  </div>
                </div>
              </motion.div>

              {/* Bottom Floating Card */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-xl"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Response Time</div>
                    <div className="text-xs text-slate-600">{"< 15 minutes"}</div>
                  </div>
                </div>
              </motion.div>

              {/* Additional Glass Elements */}
              <motion.div
                className="absolute top-1/4 -left-8 bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-white/40 shadow-lg"
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
                  <Users className={colors.text} size={16} />
                  <span className="text-xs font-medium text-slate-700">50K+ Users</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-1/3 -right-8 bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-white/40 shadow-lg"
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
                  <Clock className={colors.text} size={16} />
                  <span className="text-xs font-medium text-slate-700">Fast Response</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center justify-center gap-3 mt-16">
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className="group">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? `w-8 ${colors.primary}` : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero