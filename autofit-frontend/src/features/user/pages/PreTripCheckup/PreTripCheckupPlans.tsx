import type React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Shield, ArrowRight, Users, Clock, Award, Star, Grid3X3, Layers } from "lucide-react"
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
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
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
    if (!plans) return { transform: "translateX(0) scale(1)", zIndex: 1, opacity: 0 }
    if (isMobile) {
      return { transform: "translateX(0) scale(1)", zIndex: 1, opacity: 1 }
    }

    const diff = index - currentIndex
    const totalCards = plans.length
    let position = diff
    if (diff > totalCards / 2) position = diff - totalCards
    if (diff < -totalCards / 2) position = diff + totalCards

    // Removed opacity changes for better visibility
    if (position === 0) {
      return { transform: "translateX(-50%) scale(1.05)", zIndex: 50, opacity: 1, left: "50%" }
    }
    if (position === -1) {
      return { transform: "translateX(-50%) scale(0.9)", zIndex: 40, opacity: 1, left: "30%" }
    }
    if (position === -2) {
      return { transform: "translateX(-50%) scale(0.8)", zIndex: 30, opacity: 1, left: "15%" }
    }
    if (position === 1) {
      return { transform: "translateX(-50%) scale(0.9)", zIndex: 40, opacity: 1, left: "70%" }
    }
    if (position === 2) {
      return { transform: "translateX(-50%) scale(0.8)", zIndex: 30, opacity: 1, left: "85%" }
    }

    return {
      transform: "translateX(-50%) scale(0.6)",
      zIndex: 1,
      opacity: 0, 
      left: "50%",
      pointerEvents: "none" as const,
    }
  }

  const renderImprovedCard = (plan: Plan, index?: number, isCarousel = false) => {
    const isCenter = isCarousel
      ? Math.abs((index || 0) - currentIndex) === 0 || Math.abs((index || 0) - currentIndex) === (plans?.length || 0)
      : false
    const isHovered = hoveredCard === plan._id

    
    const maxFeatures = isCarousel ? (isCenter ? 5 : 3) : 6 
    const visibleFeatures = plan.features.slice(0, maxFeatures)
    const remainingFeatures = plan.features.length - maxFeatures

    return (
      <div
        key={plan._id}
        className={`relative transition-all duration-300 ${!isCarousel ? "cursor-pointer" : ""}`}
        onMouseEnter={() => !isCarousel && setHoveredCard(plan._id)}
        onMouseLeave={() => !isCarousel && setHoveredCard(null)}
        onClick={() => !isCarousel && handlePlanSelect(plan._id)}
      >
        {/* Fixed Height Card Container */}
        <div
          className={`relative bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
            isCarousel ? "h-[560px]" : "h-[630px]" 
          } ${
            plan.isPopular && (isCarousel ? isCenter : true)
              ? "border-blue-500 shadow-lg shadow-blue-500/10"
              : "border-gray-200 shadow-md"
          } ${!isCarousel && isHovered ? "transform scale-[1.02] shadow-lg" : ""}`}
        >
          {/* Popular Badge */}
          {plan.isPopular && ((isCarousel && isCenter) || !isCarousel) && (
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                Popular
              </div>
            </div>
          )}

          {/* Discount Badge */}
          {((isCarousel && isCenter) || !isCarousel) && plan.originalPrice && plan.originalPrice > plan.price && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
                {getDiscountPercentage(plan.originalPrice, plan.price)}% OFF
              </div>
            </div>
          )}

          {/* Card Content with Better Layout */}
          <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className="flex-shrink-0 text-center p-6 pb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

              {/* Improved Time Design */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-gray-100 rounded-lg p-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">{formatPlanDuration(plan.duration)}</div>
                  <div className="text-xs text-gray-500">inspection time</div>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex-shrink-0 text-center px-6 pb-4">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                {plan.originalPrice && plan.originalPrice > plan.price && (
                  <span className="text-lg text-gray-400 line-through">₹{plan.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">per inspection</p>
              {plan.originalPrice && plan.originalPrice > plan.price && (
                <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-200">
                  <span className="text-sm font-medium">
                    Save ₹{(plan.originalPrice - plan.price).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Features Section - Better Space Management */}
            <div className="flex-grow px-6 pb-4 min-h-0">
              <div className="h-full flex flex-col">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex-shrink-0">
                  What's Included:
                </h4>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    {visibleFeatures.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* More Features - Only visible if remainingFeatures > 0 */}
                  {remainingFeatures > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <span className="text-sm font-medium text-blue-700">
                          +{remainingFeatures} more feature{remainingFeatures > 1 ? "s" : ""} included
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Button Section - Fixed at Bottom */}
            <div className="flex-shrink-0 p-6 pt-0">
              <Button
                className={`w-full py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                  plan.isPopular && ((isCarousel && isCenter) || !isCarousel)
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white" // Popular button color
                    : "bg-blue-600 hover:bg-blue-700 text-white" // Changed default button color to blue
                } ${isHovered && !isCarousel ? "scale-[1.02]" : ""}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlanSelect(plan._id)
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Select {plan.name}
                  <ArrowRight className="h-4 w-4" />
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center pt-16 pb-12 px-6">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-lg px-4 py-2 mb-8 border border-blue-200">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Trusted by 50,000+ drivers</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Vehicle Inspection Plans</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Professional pre-trip inspections to ensure your vehicle is road-ready and safe
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-12">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span>50K+ customers</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-green-600" />
            <span>ASE certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span>Same day service</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span>4.9/5 rating</span>
          </div>
        </div>

        {/* View Toggle */}
        {!isMobile && (
          <div className="inline-flex bg-white rounded-lg p-1 border border-gray-200 mb-16">
            <button
              onClick={() => setViewMode("carousel")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                viewMode === "carousel" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Layers className="h-4 w-4" />
              Carousel
            </button>
            <button
              onClick={() => setViewMode("slide")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                viewMode === "slide" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              Grid
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {viewMode === "carousel" ? (
          <>
            {/* Carousel View */}
            <div
              ref={containerRef}
              className={`relative ${
                isMobile ? "overflow-hidden py-4" : "h-[600px] py-8 flex items-center justify-center" // Adjusted height
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
                    <div key={plan._id} className="flex-shrink-0 w-full px-4">
                      {renderImprovedCard(plan, index, true)}
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
                        className="absolute w-96 transition-all duration-700 ease-out cursor-pointer"
                        style={style}
                        onClick={() => goToSlide(index)}
                      >
                        {renderImprovedCard(plan, index, true)}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <button
                onClick={prevSlide}
                className="bg-white border border-gray-200 rounded-full p-3 hover:bg-gray-50 transition-all duration-300"
                aria-label="Previous plan"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>

              <div className="flex gap-2">
                {plans.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-blue-600 w-6" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to plan ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="bg-white border border-gray-200 rounded-full p-3 hover:bg-gray-50 transition-all duration-300"
                aria-label="Next plan"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors bg-white rounded-lg px-4 py-2 border border-gray-200"
                aria-label={isAutoPlaying ? "Pause slideshow" : "Resume slideshow"}
              >
                {isAutoPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
            </div>
          </>
        ) : (
          /* Grid View - Fixed Heights */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {plans.map((plan, index) => renderImprovedCard(plan, index))}
          </div>
        )}
      </div>
    </div>
  )
}
