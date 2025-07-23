import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ChevronLeft, ChevronRight, Shield, ArrowRight, Users, Clock, Award, Star } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useGetPretripPlansQuery } from "@/services/userServices/pretripUserApi"
import { Plan } from "@/types/plans"
import {PlanPageShimmer} from "../../components/shimmer/pretrip/PlanPageShimmer"


export default function PreTripCheckupPlans() {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { data: plans, isLoading } = useGetPretripPlansQuery({})
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(plans?.length ? plans[1] : null)
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || isDragging || isLoading || !plans) return
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % plans.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, isDragging, isLoading, plans])

  useEffect(() => {
    if (plans?.length) {
      setSelectedPlan(plans[currentIndex])
    }
  }, [currentIndex, plans])

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
    setIsDragging(true)
    setStartX(clientX)
    setCurrentX(clientX)
    setIsAutoPlaying(false)
  }

  const handlePlanSelect = (planId: string) => {
    console.log(planId);
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    setCurrentX(clientX)
  }

  const handleEnd = () => {
    if (!isDragging || !plans) return
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

    const maxVisibleCards = totalCards >= 5 ? 5 : totalCards >= 3 ? 3 : totalCards
    const maxSideCards = Math.floor(maxVisibleCards / 2)

    if (position === 0) {
      return { transform: "translateX(-50%) scale(1.1)", zIndex: 50, opacity: 1, left: "50%" }
    }
    if (position === -1 && maxSideCards >= 1) {
      return { transform: "translateX(-50%) scale(0.95)", zIndex: 45, opacity: 0.95, left: "35%" }
    }
    if (position === -2 && maxSideCards >= 2) {
      return { transform: "translateX(-50%) scale(0.9)", zIndex: 40, opacity: 0.9, left: "20%" }
    }
    if (position === 1 && maxSideCards >= 1) {
      return { transform: "translateX(-50%) scale(0.95)", zIndex: 45, opacity: 0.95, left: "65%" }
    }
    if (position === 2 && maxSideCards >= 2) {
      return { transform: "translateX(-50%) scale(0.9)", zIndex: 40, opacity: 0.9, left: "80%" }
    }
    return { transform: "translateX(-50%) scale(0.6)", zIndex: 1, opacity: 0, left: "50%", pointerEvents: "none" as const }
  }

  if (isLoading || !plans) return <PlanPageShimmer />

  return (
    <div className="min-h-screen mt-14 bg-gray-50 overflow-hidden">
      <div className="text-center pt-6 pb-4 px-4">
        <div className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-full px-4 py-2 mb-4 shadow-lg">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Trusted by 50,000+ Drivers</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Pre-Trip Vehicle Inspection Plans</h1>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-4">
          Choose the perfect inspection package and drive with confidence. Professional service, guaranteed results.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
            <Users className="h-3 w-3 text-blue-600" />
            <span>50K+ Customers</span>
          </div>
          <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
            <Award className="h-3 w-3 text-green-600" />
            <span>ASE Certified</span>
          </div>
          <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
            <Clock className="h-3 w-3 text-orange-600" />
            <span>Same Day</span>
          </div>
          <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-sm">
            <Star className="h-3 w-3 text-yellow-600" />
            <span>4.9/5 Rating</span>
          </div>
        </div>
      </div>
      <div className="relative px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          <div
            ref={containerRef}
            className={`relative ${isMobile ? "overflow-hidden py-2" : "h-[65vh] py-4 flex items-center justify-center"} cursor-grab active:cursor-grabbing`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={isDragging ? handleMouseMove : undefined}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {isMobile ? (
              <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {plans.map((plan) => (
                  <div key={plan._id} className="flex-shrink-0 w-full px-3">
                    <Card
                      className={`relative transition-all duration-500 bg-white shadow-xl border-2 rounded-lg h-[70vh] flex flex-col ${
                        plan.isPopular ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                      }`}
                    >
                      {plan.originalPrice && plan.originalPrice > plan.price && (
                        <div className="absolute -top-3 right-4 z-10">
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {getDiscountPercentage(plan.originalPrice, plan.price)}% OFF
                          </div>
                        </div>
                      )}
                      {plan.isPopular && (
                        <div className="absolute -top-3 left-4 z-10">
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            POPULAR
                          </div>
                        </div>
                      )}
                      <CardHeader className="text-center pt-8 pb-4 px-6">
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                        <CardDescription className="text-gray-600 text-sm mb-4">{plan.description}</CardDescription>
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-blue-600">₹{plan.price.toLocaleString()}</span>
                            {plan.originalPrice && plan.originalPrice > plan.price && (
                              <div className="text-left">
                                <div className="text-gray-500 line-through text-sm">₹{plan.originalPrice.toLocaleString()}</div>
                                <div className="text-gray-600 text-xs">per inspection</div>
                              </div>
                            )}
                          </div>
                          {plan.originalPrice && plan.originalPrice > plan.price && (
                            <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 rounded-full px-3 py-1 border border-green-200">
                              <span className="text-xs font-medium">Save ₹{(plan.originalPrice - plan.price).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 flex flex-col flex-grow">
                        <div className="bg-gray-50 rounded-lg p-4 mb-4 flex-grow">
                          <ul className="space-y-3">
                            {plan.features.slice(0, 4).map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start">
                                <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                                  <Check className="h-3 w-3 text-green-600" />
                                </div>
                                <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                              </li>
                            ))}
                            {plan.features.length > 4 && (
                              <li className="text-xs text-blue-600 ml-7 font-medium">+{plan.features.length - 4} more features available</li>
                            )}
                          </ul>
                        </div>
                        <Button
                          className={`w-full py-3 text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                            plan.isPopular ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-800 hover:bg-gray-900 text-white"
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Select {plan.name} Plan
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                {plans.map((plan, index) => {
                  const style = getCardTransform(index)
                  const isCenter = Math.abs(index - currentIndex) === 0 || Math.abs(index - currentIndex) === plans.length
                  return (
                    <div
                      key={plan._id}
                      className="absolute w-80 transition-all duration-700 ease-out cursor-pointer"
                      style={style}
                      onClick={() => goToSlide(index)}
                    >
                      <Card
                        className={`h-[55vh] flex flex-col transition-all duration-500 bg-white shadow-2xl border-2 rounded-lg ${
                          plan.isPopular && isCenter ? "border-blue-500 ring-4 ring-blue-200" : "border-gray-200"
                        }`}
                      >
                        {isCenter && plan.originalPrice && plan.originalPrice > plan.price && (
                          <div className="absolute -top-3 right-6 z-10">
                            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                              {getDiscountPercentage(plan.originalPrice, plan.price)}% OFF
                            </div>
                          </div>
                        )}
                        {plan.isPopular && isCenter && (
                          <div className="absolute -top-3 left-6 z-10">
                            <div className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              POPULAR
                            </div>
                          </div>
                        )}
                        <CardHeader className="text-center pt-8 pb-4 px-6">
                          <CardTitle className="text-xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                          <CardDescription className="text-gray-600 text-sm mb-4">{plan.description}</CardDescription>
                          <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-2xl font-bold text-blue-600">₹{plan.price.toLocaleString()}</span>
                              {plan.originalPrice && plan.originalPrice > plan.price && (
                                <div className="text-left">
                                  <div className="text-gray-500 line-through text-sm">₹{plan.originalPrice.toLocaleString()}</div>
                                  <div className="text-gray-600 text-xs">per inspection</div>
                                </div>
                              )}
                            </div>
                            {plan.originalPrice && plan.originalPrice > plan.price && (
                              <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 rounded-full px-3 py-1 border border-green-200">
                                <span className="text-xs font-medium">Save ₹{(plan.originalPrice - plan.price).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 flex flex-col flex-grow">
                          <div className="bg-gray-50 rounded-lg p-4 mb-4 flex-grow overflow-hidden">
                            <ul className="space-y-3">
                              {plan.features.slice(0, isCenter ? 5 : 4).map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start">
                                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                                    <Check className="h-3 w-3 text-green-600" />
                                  </div>
                                  <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                                </li>
                              ))}
                              {((isCenter && plan.features.length > 5) || (!isCenter && plan.features.length > 4)) && (
                                <li className="text-xs text-blue-600 ml-7 font-medium">
                                  +{plan.features.length - (isCenter ? 5 : 4)} more features available
                                </li>
                              )}
                            </ul>
                          </div>
                          <Button
                            className={`w-full py-3 text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                              plan.isPopular && isCenter ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-800 hover:bg-gray-900 text-white"
                            }`}
                            onClick={
                              (e) =>{
                                e.stopPropagation()
                                handlePlanSelect(plan._id)
                              } 
                            }
                          >
                            Select {plan.name} Plan
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <button
              onClick={prevSlide}
              className="bg-white shadow-xl border border-gray-200 rounded-full p-3 hover:bg-gray-50 hover:scale-110 transition-all duration-300"
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
                    index === currentIndex ? "bg-blue-600 w-8" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to plan ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="bg-white shadow-xl border border-gray-200 rounded-full p-3 hover:bg-gray-50 hover:scale-110 transition-all duration-300"
              aria-label="Next plan"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {selectedPlan && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="font-bold text-lg text-gray-900">{selectedPlan.name} Plan</h3>
                <p className="text-sm text-gray-600 mb-1">{selectedPlan.description}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xl font-bold text-blue-600">₹{selectedPlan.price.toLocaleString()}</span>
                  {selectedPlan.originalPrice && selectedPlan.originalPrice > selectedPlan.price && (
                    <>
                      <span className="text-sm text-gray-500 line-through">₹{selectedPlan.originalPrice.toLocaleString()}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        Save ₹{(selectedPlan.originalPrice - selectedPlan.price).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto rounded-lg"
                aria-label={`Book ${selectedPlan.name} plan`}
                onClick={()=>handlePlanSelect(selectedPlan._id)}
              >
                Book {selectedPlan.name} Now
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="text-center mt-2">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-gray-500 hover:text-gray-700 text-sm transition-colors bg-white rounded-full px-3 py-1 shadow-sm"
          aria-label={isAutoPlaying ? "Pause slideshow" : "Resume slideshow"}
        >
          {isAutoPlaying ? "⏸ Pause slideshow" : "▶ Resume slideshow"}
        </button>
      </div>
    </div>
  )
}

