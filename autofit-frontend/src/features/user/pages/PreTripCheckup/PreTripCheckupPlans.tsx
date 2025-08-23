import type React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight, Users, Clock, Award, Star, Grid3X3, Layers, Check, Sparkles } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useGetPretripPlansQuery } from "@/services/userServices/pretripUserApi"
import type { Plan } from "@/types/plans"
import { PlanPageShimmer } from "../../components/shimmer/pretrip/PlanPageShimmer"
import { useNavigate } from "react-router-dom"

type ViewMode = "carousel" | "slide"

export default function PreTripCheckupPlans() {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("carousel")
  const { data: plans, isLoading } = useGetPretripPlansQuery({})
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      const small = window.innerWidth < 640
      setIsMobile(mobile)
      setIsSmallScreen(small)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || isDragging || isLoading || !plans || viewMode === "slide") return
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % plans.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, isDragging, isLoading, plans, viewMode])

  const formatPlanDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`
    } else if (minutes % 60 === 0) {
      return `${Math.floor(minutes / 60)}hr`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h ${remainingMinutes}m`
    }
  }

  const nextSlide = () => {
    if (!plans) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % plans.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    if (!plans) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + plans.length) % plans.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const handleStart = (clientX: number) => {
    if (viewMode === "slide") return
    setIsDragging(true)
    setStartX(clientX)
    setCurrentX(clientX)
    setIsAutoPlaying(false)
  }

  const handlePlanSelect = (planId: string) => {
    navigate(`/user/pretrip-checkup/booking/${planId}`)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging || viewMode === "slide") return
    setCurrentX(clientX)
  }

  const handleEnd = () => {
    if (!isDragging || !plans || viewMode === "slide") return
    setIsDragging(false)
    const diff = startX - currentX
    const threshold = 50
    if (Math.abs(diff) > threshold) {
      if (diff > 0) nextSlide()
      else prevSlide()
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX)
  const handleTouchEnd = () => handleEnd()
  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.clientX)
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX)
  const handleMouseUp = () => handleEnd()
  const handleMouseLeave = () => handleEnd()

  const getDiscountPercentage = (original?: number, current?: number) => {
    if (!original || !current || original <= current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  const getCardTransform = (index: number) => {
    if (!plans) return { transform: "translateX(0) scale(1)", zIndex: 1, opacity: 1 }
    if (isMobile) {
      return { transform: "translateX(0) scale(1)", zIndex: 1, opacity: 1 }
    }

    const diff = index - currentIndex
    const totalCards = plans.length
    let position = diff
    if (diff > totalCards / 2) position = diff - totalCards
    if (diff < -totalCards / 2) position = diff + totalCards

    if (position === 0) {
      return { transform: "translateX(-50%) scale(1.05)", zIndex: 50, opacity: 1, left: "50%" }
    }
    if (position === -1) {
      return { transform: "translateX(-50%) scale(0.9)", zIndex: 40, opacity: 0.8, left: "25%" }
    }
    if (position === -2) {
      return { transform: "translateX(-50%) scale(0.8)", zIndex: 30, opacity: 0.6, left: "10%" }
    }
    if (position === 1) {
      return { transform: "translateX(-50%) scale(0.9)", zIndex: 40, opacity: 0.8, left: "75%" }
    }
    if (position === 2) {
      return { transform: "translateX(-50%) scale(0.8)", zIndex: 30, opacity: 0.6, left: "90%" }
    }

    return {
      transform: "translateX(-50%) scale(0.6)",
      zIndex: 1,
      opacity: 0,
      left: "50%",
      pointerEvents: "none" as const,
    }
  }

  const renderPlanCard = (plan: Plan, index?: number, isCarousel = false) => {
    const isCenter = isCarousel
      ? Math.abs((index || 0) - currentIndex) === 0 || Math.abs((index || 0) - currentIndex) === (plans?.length || 0)
      : false
    const isHovered = hoveredCard === plan._id
    const isPopular = plan.isPopular && ((isCarousel && isCenter) || !isCarousel)

    // Enhanced feature count based on screen size
    let maxFeatures = 6 // Default to 6 features
    if (isCarousel) {
      if (isMobile) {
        maxFeatures = 6 // Show 6 features on mobile
      } else {
        maxFeatures = isCenter ? 4 : 3
      }
    } else {
      maxFeatures = isSmallScreen ? 5 : 6
    }
    
    const visibleFeatures = plan.features.slice(0, maxFeatures)
    const remainingFeatures = plan.features.length - maxFeatures

    return (
      <div
        key={plan._id}
        className={`relative transition-all duration-500 ${!isCarousel ? "cursor-pointer" : ""} group`}
        onMouseEnter={() => !isCarousel && setHoveredCard(plan._id)}
        onMouseLeave={() => !isCarousel && setHoveredCard(null)}
        onClick={() => !isCarousel && handlePlanSelect(plan._id)}
      >
        <div
          className={`relative bg-white border overflow-hidden transition-all duration-500 rounded-xl ${
            isMobile 
              ? "h-[600px] mx-1 shadow-lg hover:shadow-xl" 
              : isCarousel
                ? "h-[480px] sm:h-[520px]"
                : "h-[580px] sm:h-[620px]"
          } ${
            isPopular
              ? "border-2 border-blue-500 shadow-xl shadow-blue-500/20"
              : "border border-gray-200 hover:border-blue-300 hover:shadow-xl"
          } ${!isCarousel && isHovered ? "transform scale-[1.02] shadow-2xl" : ""}`}
        >
          {/* Popular Badge */}
          {isPopular && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl">
                <Sparkles className="h-3.5 w-3.5 fill-current" />
                Most Popular
              </div>
            </div>
          )}

          {/* Discount Badge */}
          {!isPopular && plan.originalPrice && plan.originalPrice > plan.price && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">
                {getDiscountPercentage(plan.originalPrice, plan.price)}% OFF
              </div>
            </div>
          )}

          {/* Card Content */}
          <div className={`h-full flex flex-col ${isMobile ? "p-4" : "p-6"}`}>
            {/* Header with enhanced styling */}
            <div className={`text-center ${isMobile ? "mb-5" : "mb-5"}`}>
              <h3 className={`font-bold text-gray-900 ${
                isMobile ? "text-xl mb-3" : "text-lg sm:text-xl mb-3"
              }`}>
                {plan.name}
              </h3>
              <p className={`text-gray-600 line-clamp-2 ${
                isMobile ? "text-sm leading-relaxed px-2" : "text-xs sm:text-sm"
              }`}>
                {plan.description}
              </p>
            </div>

            {/* Enhanced Pricing Section */}
            <div className={`text-center ${isMobile ? "mb-5" : "mb-5"}`}>
              <div className="flex items-baseline justify-center gap-2 mb-3">
                <span className={`font-bold text-gray-900 ${
                  isMobile ? "text-3xl" : "text-2xl sm:text-3xl"
                }`}>
                  ₹{plan.price.toLocaleString()}
                </span>
                {plan.originalPrice && plan.originalPrice > plan.price && (
                  <span className={`text-gray-400 line-through ${
                    isMobile ? "text-lg" : "text-sm"
                  }`}>
                    ₹{plan.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className={`text-gray-500 ${isMobile ? "text-sm mb-4" : "text-xs mb-4"}`}>
                per inspection
              </p>
              
              {/* Modern badge layout with row order */}
              <div className={`flex items-center justify-center ${isMobile ? "gap-3" : "gap-4"}`}>
                <div className={`inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full ${
                  isMobile ? "px-4 py-2.5" : "px-4 py-2"
                }`}>
                  <Clock className={`text-blue-600 ${isMobile ? "h-4 w-4" : "h-3.5 w-3.5"}`} />
                  <span className={`font-semibold text-blue-800 ${isMobile ? "text-sm" : "text-xs"}`}>
                    {formatPlanDuration(plan.duration)}
                  </span>
                </div>

                {plan.originalPrice && plan.originalPrice > plan.price && (
                  <div className={`inline-flex items-center bg-green-50 border border-green-200 rounded-full ${
                    isMobile ? "px-4 py-2.5" : "px-4 py-2"
                  }`}>
                    <span className={`text-green-700 font-semibold ${isMobile ? "text-sm" : "text-xs"}`}>
                      Save ₹{(plan.originalPrice - plan.price).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Features Section */}
            <div className="flex-grow">
              <h4 className={`font-bold text-gray-800 flex items-center gap-2 ${
                isMobile ? "text-sm mb-3" : "text-sm mb-4"
              }`}>
                <Check className={`text-green-600 ${isMobile ? "h-4 w-4" : "h-4 w-4"}`} />
                What's Included
              </h4>
              <div className={`${isMobile ? "space-y-2.5" : "space-y-3"}`}>
                {visibleFeatures.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3 group">
                    <div className={`bg-green-100 rounded-full p-0.5 flex-shrink-0 ${isMobile ? "mt-0.5" : "mt-0.5"}`}>
                      <Check className={`text-green-600 ${
                        isMobile ? "h-3 w-3" : "h-3 w-3"
                      }`} />
                    </div>
                    <span className={`text-gray-700 leading-relaxed font-medium ${
                      isMobile ? "text-sm" : "text-xs"
                    } group-hover:text-gray-900 transition-colors`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {remainingFeatures > 0 && (
                <div className={`${isMobile ? "mt-4" : "mt-4"}`}>
                  <span className={`inline-block bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-medium ${
                    isMobile ? "text-sm px-4 py-2" : "text-xs px-3 py-1"
                  }`}>
                    +{remainingFeatures} more {remainingFeatures === 1 ? 'feature' : 'features'}
                  </span>
                </div>
              )}
            </div>

            {/* Modern CTA Button */}
            <div className={`mt-auto ${isMobile ? "pt-4" : "pt-4"}`}>
              <Button
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                  isMobile ? "text-sm py-4 px-6" : "text-sm py-3"
                } ${isPopular ? "ring-2 ring-blue-300 bg-blue-700" : ""}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlanSelect(plan._id)
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {isPopular ? "Choose Popular Plan" : "Select This Plan"}
                  <ArrowRight className={`${isMobile ? "h-4 w-4" : "h-4 w-4"} transition-transform group-hover:translate-x-1`} />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !plans) return <PlanPageShimmer />

  return (
    <div className="min-h-screen bg-gray-50 mt-16 sm:mt-6">
      {/* Enhanced Header with trust indicator */}
      <div className={`max-w-4xl mx-auto text-center px-4 sm:px-4 lg:px-6 ${
        isMobile 
          ? "pt-4 pb-3" 
          : "pt-6 sm:pt-8 lg:pt-16 pb-4 sm:pb-8 lg:pb-12"
      }`}>
        {/* Trust Badge with modern design */}
        <div className={`inline-flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-sm border mb-4 sm:mb-6 ${
          isMobile ? "text-xs" : "text-sm"
        }`}>
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
          <span className="font-medium text-gray-700 whitespace-nowrap">
            Trusted by 50,000+ drivers
          </span>
        </div>

        {/* Enhanced Main Heading with better typography */}
        <h1 className={`font-bold text-gray-900 mb-3 sm:mb-4 leading-tight ${
          isMobile 
            ? "text-2xl xs:text-3xl px-2" 
            : "text-3xl sm:text-4xl md:text-5xl"
        }`}>
          Choose Your Perfect{" "}
          <span className="text-blue-600 block xs:inline">
            Inspection Plan
          </span>
        </h1>
        <p className={`text-gray-600 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4 ${
          isMobile 
            ? "text-sm xs:text-base mb-4" 
            : "text-base sm:text-lg mb-6 sm:mb-8"
        }`}>
          Professional pre-trip inspections designed for your vehicle's safety and your peace of mind. Expert technicians, transparent pricing, same-day service.
        </p>

        {/* Enhanced Social Proof */}
        <div className={`flex flex-wrap justify-center text-gray-600 ${
          isMobile 
            ? "gap-3 text-sm mb-4" 
            : "gap-4 sm:gap-8 text-sm mb-6 sm:mb-8"
        }`}>
          <div className={`flex items-center bg-white rounded-lg px-3 py-2 shadow-sm ${isMobile ? "gap-1.5" : "gap-2"}`}>
            <Users className={`text-blue-600 ${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
            <span className="font-medium">50K+ customers</span>
          </div>
          <div className={`flex items-center bg-white rounded-lg px-3 py-2 shadow-sm ${isMobile ? "gap-1.5" : "gap-2"}`}>
            <Award className={`text-green-600 ${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
            <span className="font-medium">Certified</span>
          </div>
          <div className={`flex items-center bg-white rounded-lg px-3 py-2 shadow-sm ${isMobile ? "gap-1.5" : "gap-2"}`}>
            <Clock className={`text-orange-600 ${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
            <span className="font-medium">Same day</span>
          </div>
          <div className={`flex items-center bg-white rounded-lg px-3 py-2 shadow-sm ${isMobile ? "gap-1.5" : "gap-2"}`}>
            <Star className={`text-yellow-600 ${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} fill-current`} />
            <span className="font-medium">4.9★</span>
          </div>
        </div>

        {/* Enhanced View Toggle - Hide on mobile */}
        {!isMobile && (
          <div className="inline-flex bg-white rounded-lg p-1 border border-gray-200 shadow-lg">
            <button
              onClick={() => setViewMode("carousel")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === "carousel" 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Layers className="h-4 w-4" />
              Carousel View
            </button>
            <button
              onClick={() => setViewMode("slide")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                viewMode === "slide" 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              Grid View
            </button>
          </div>
        )}
      </div>

      {/* Plans Content */}
      <div className={`max-w-6xl mx-auto px-4 sm:px-4 lg:px-6 ${
        isMobile ? "pb-6" : "pb-8 sm:pb-12"
      }`}>
        {viewMode === "carousel" || isMobile ? (
          <>
            {/* Enhanced Carousel */}
            <div
              ref={containerRef}
              className={`relative ${
                isMobile 
                  ? "overflow-hidden py-2" 
                  : "h-[520px] py-8 flex items-center justify-center"
              } cursor-grab active:cursor-grabbing`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={isDragging ? handleMouseMove : undefined}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {isMobile ? (
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {plans.map((plan, index) => (
                    <div key={plan._id} className="flex-shrink-0 w-full px-2">
                      {renderPlanCard(plan, index, true)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  {plans.map((plan, index) => {
                    const style = getCardTransform(index)
                    return (
                      <div
                        key={plan._id}
                        className="absolute w-80 transition-all duration-700 ease-out cursor-pointer"
                        style={style}
                        onClick={() => goToSlide(index)}
                      >
                        {renderPlanCard(plan, index, true)}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Enhanced Controls */}
            <div className={`flex items-center justify-center gap-6 ${isMobile ? "mt-4" : "mt-8"}`}>
              <button
                onClick={prevSlide}
                className={`bg-white border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-lg ${
                  isMobile ? "p-3" : "p-3"
                }`}
                aria-label="Previous plan"
              >
                <ChevronLeft className={`text-blue-600 ${isMobile ? "h-5 w-5" : "h-5 w-5"}`} />
              </button>

              <div className={`flex ${isMobile ? "gap-2" : "gap-2"}`}>
                {plans.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`rounded-full transition-all duration-300 ${
                      isMobile ? "h-2.5" : "h-2.5"
                    } ${
                      index === currentIndex 
                        ? `bg-blue-600 ${isMobile ? "w-8" : "w-8"} shadow-md` 
                        : `bg-gray-300 hover:bg-gray-400 ${isMobile ? "w-2.5" : "w-2.5"}`
                    }`}
                    aria-label={`Go to plan ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className={`bg-white border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-lg ${
                  isMobile ? "p-3" : "p-3"
                }`}
                aria-label="Next plan"
              >
                <ChevronRight className={`text-blue-600 ${isMobile ? "h-5 w-5" : "h-5 w-5"}`} />
              </button>
            </div>

            {!isMobile && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="text-gray-600 hover:text-gray-800 text-sm transition-colors bg-white rounded-lg px-6 py-3 border-2 border-gray-200 hover:border-gray-300 font-medium shadow-lg"
                >
                  {isAutoPlaying ? "⏸ Pause Slideshow" : "▶ Resume Slideshow"}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Enhanced Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => renderPlanCard(plan, index))}
          </div>
        )}
      </div>
    </div>
  )
}