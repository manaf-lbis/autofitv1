import type React from "react"
import { useState, useEffect } from "react"
import { ArrowRight, Shield, Video, MapPin } from "lucide-react"
import livetrackingImg from '@/assets/userSide/hero/realtimeTracking.png'
import roadsideAssImg  from '@/assets/userSide/hero/workigMechHero.png'
import realTimeAss from '@/assets/userSide/hero/raltimeAssistance.png'
import { useNavigate } from "react-router-dom"

const slides = [
  {
    id: 1,
    title: "Emergency Roadside Assistance",
    subtitle: "24/7 Professional Help",
    description:
      "Get instant help from certified mechanics available around the clock. Fast response, reliable service, and complete peace of mind.",
    image: roadsideAssImg,
    accent: "blue",
    icon: Shield,
    link :'/roadside-assistance'
  },
  {
    id: 2,
    title: "Live Video Diagnostics",
    subtitle: "Expert Mechanics Online",
    description:
      "Connect instantly with certified professionals through HD video calls for real-time diagnosis and step-by-step guidance.",
    image: realTimeAss,
    accent: "emerald",
    icon: Video,
    link :'/services'
  },
  {
    id: 3,
    title: "Real-time GPS Tracking",
    subtitle: "Know Where Help Is",
    description:
      "Track your assigned mechanic in real-time with precise GPS location and live ETA updates throughout the entire service.",
    image: livetrackingImg,
    accent: "violet",
    icon: MapPin,
    link : '/pretrip-checkup/plans'
  },
]
const accentColors = {
  blue: {
    gradient: "from-blue-500 to-cyan-500",
    solid: "bg-blue-500 hover:bg-blue-600",
    style: { backgroundColor: "#3b82f6" },
    hoverStyle: { backgroundColor: "#0ea5e9" },
  },
  emerald: {
    gradient: "from-emerald-500 to-teal-500",
    solid: "bg-emerald-500 hover:bg-emerald-600",
    style: { backgroundColor: "#10b981" },
    hoverStyle: { backgroundColor: "#14b8a6" },
  },
  violet: {
    gradient: "from-violet-500 to-purple-500",
    solid: "bg-violet-500 hover:bg-violet-600",
    style: { backgroundColor: "#8b5cf6" },
    hoverStyle: { backgroundColor: "#a855f7" },
  },
}

const Hero = ()=> {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000) 

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000) 
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsAutoPlaying(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) nextSlide()
    if (isRightSwipe) prevSlide()

    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart(e.clientX)
    setIsAutoPlaying(false)
    e.preventDefault()
  }

  const handleNavigate = (link: string) => {
      navigate(link)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return
    e.preventDefault()
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return

    const dragEnd = e.clientX
    const distance = dragStart - dragEnd
    const isLeftDrag = distance > 75
    const isRightDrag = distance < -75

    if (isLeftDrag) nextSlide()
    if (isRightDrag) prevSlide()

    setIsDragging(false)
    setDragStart(null)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      setDragStart(null)
      setTimeout(() => setIsAutoPlaying(true), 8000)
    }
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-24">
      <div className="relative overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-out cursor-grab active:cursor-grabbing select-none"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {slides.map((slide, index) => {
            const gradientColors = accentColors[slide.accent as keyof typeof accentColors]
            const IconComponent = slide.icon
            const isActive = index === currentSlide

            return (
              <div key={slide.id} className="w-full flex-shrink-0">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0 min-h-[500px] sm:min-h-[550px] lg:min-h-[450px] xl:min-h-[500px] bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">

                  <div className="relative flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-12 lg:py-16 order-2 lg:order-1">
                    <div
                      className={`relative space-y-6 sm:space-y-8 max-w-lg mx-auto lg:mx-0 text-center lg:text-left transition-all duration-1000 ${isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-70"}`}
                    >

                      <div className="flex items-center justify-center lg:justify-start gap-3 group">
                        <div
                          className={`relative p-3 sm:p-4 rounded-2xl bg-gradient-to-r ${gradientColors.gradient} shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}
                        >
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          <div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradientColors.gradient} blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                          />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-300 tracking-wide uppercase">
                          {slide.subtitle}
                        </span>
                      </div>

                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight text-balance">
                        <span
                          className={`inline-block transition-all duration-700 delay-100 ${isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-70"}`}
                        >
                          {slide.title.split(" ").slice(0, -1).join(" ")}
                        </span>
                        <br />
                        <span
                          className={`inline-block bg-gradient-to-r ${gradientColors.gradient} bg-clip-text text-transparent transition-all duration-700 delay-200 ${isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-70"}`}
                        >
                          {slide.title.split(" ").slice(-1)[0]}
                        </span>
                      </h1>


                      <p
                        className={`text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto lg:mx-0 transition-all duration-700 delay-300 text-pretty ${isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-70"}`}
                      >
                        {slide.description}
                      </p>


                      <div
                        className={`pt-4 sm:pt-6 transition-all duration-700 delay-400 ${isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-70"}`} 
                        onClick={() => handleNavigate(slide.link)}
                      >
                        <button
                          className={`group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-white font-semibold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden text-sm sm:text-base`}
                          style={gradientColors.style}
                          onMouseEnter={(e) => {
                            Object.assign(e.currentTarget.style, gradientColors.hoverStyle)
                          }}
                          onMouseLeave={(e) => {
                            Object.assign(e.currentTarget.style, gradientColors.style)
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                          <span className="relative">Get Help Now</span>
                          <ArrowRight className="relative w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16 order-1 lg:order-2">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div
                        className={`absolute top-8 right-8 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${gradientColors.gradient} opacity-5 rounded-full blur-2xl animate-pulse`}
                      />
                      <div
                        className={`absolute bottom-8 left-8 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr ${gradientColors.gradient} opacity-5 rounded-full blur-2xl animate-pulse delay-1000`}
                      />
                    </div>

                    <div
                      className={`relative w-full h-56 sm:h-72 lg:h-full max-w-sm sm:max-w-md lg:max-w-lg transition-all duration-1000 ${isActive ? "scale-100 rotate-0" : "scale-95 rotate-1"}`}
                    >
                      <img
                        src={
                          slide.image ||
                          `/placeholder.svg?height=500&width=500&query=${encodeURIComponent(slide.title) || "/placeholder.svg"}`
                        }
                        alt={slide.title}
                        className="w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-2xl"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/3 via-transparent to-white/3 rounded-2xl sm:rounded-3xl" />

                      <div
                        className={`absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${gradientColors.gradient} rounded-full shadow-lg animate-bounce`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 sm:gap-3 mt-6 sm:mt-8">
        {slides.map((_, index) => {
          const gradientColors = accentColors[slides[currentSlide].accent as keyof typeof accentColors]
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 sm:h-3 rounded-full transition-all duration-500 hover:scale-125 active:scale-95 ${
                index === currentSlide
                  ? `w-8 sm:w-12 bg-gradient-to-r ${gradientColors.gradient} shadow-lg`
                  : "w-2 sm:w-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}



export default Hero