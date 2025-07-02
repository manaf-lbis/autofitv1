"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ChevronLeft, ChevronRight, Shield, ArrowRight, Users, Clock, Award, Star } from "lucide-react"
import { useState, useEffect, useRef } from "react"

const plans = [
  {
    id: 1,
    name: "Essential",
    price: 2999,
    originalPrice: 3999,
    popular: false,
    description: "Perfect for short trips",
    features: [
      "Tire pressure check",
      "Basic brake inspection",
      "Fluid levels check",
      "Battery test",
      "Light functionality",
    ],
  },
  {
    id: 2,
    name: "Standard",
    price: 5999,
    originalPrice: 7999,
    popular: true,
    description: "Most comprehensive package",
    features: [
      "All Essential items",
      "Engine diagnostic scan",
      "Air filter inspection",
      "Belts and hoses check",
      "Suspension system check",
      "Exhaust inspection",
      "Windshield wipers",
    ],
  },
  {
    id: 3,
    name: "Premium",
    price: 9999,
    originalPrice: 12999,
    popular: false,
    description: "Complete vehicle assessment",
    features: [
      "All Standard items",
      "Transmission inspection",
      "Cooling system check",
      "Fuel system inspection",
      "AC performance test",
      "Wheel alignment check",
      "Interior safety features",
      "Emergency kit inspection",
    ],
  },
  {
    id: 4,
    name: "Deluxe",
    price: 13999,
    originalPrice: 17999,
    popular: false,
    description: "Ultimate peace of mind",
    features: [
      "All Premium items",
      "Advanced diagnostics",
      "Full electrical check",
      "GPS system test",
      "Detailed report",
      "Priority scheduling",
      "30-day roadside assistance",
      "Post-trip follow-up",
    ],
  },
  {
    id: 5,
    name: "Executive",
    price: 19999,
    originalPrice: 24999,
    popular: false,
    description: "VIP treatment for luxury vehicles",
    features: [
      "All Deluxe items",
      "Luxury vehicle specialist",
      "Interior detailing",
      "Premium parts warranty",
      "Concierge service",
      "Express lane service",
      "90-day roadside assistance",
      "Monthly health reports",
    ],
  },
  {
    id: 6,
    name: "Fleet Pro",
    price: 15999,
    originalPrice: 19999,
    popular: false,
    description: "Perfect for business fleets",
    features: [
      "All Premium items",
      "Fleet management tools",
      "Bulk pricing available",
      "Digital fleet reports",
      "Priority booking",
      "24/7 support hotline",
      "Custom maintenance schedules",
      "Driver safety training",
    ],
  },
]

export default function PreTripCheckupPlans() {
  const [currentIndex, setCurrentIndex] = useState(1) // Start with popular plan
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState(plans[1])
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || isDragging) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % plans.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, isDragging])

  // Update selected plan when index changes
  useEffect(() => {
    setSelectedPlan(plans[currentIndex])
  }, [currentIndex])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % plans.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + plans.length) % plans.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  // Touch and Mouse event handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
    setCurrentX(clientX)
    setIsAutoPlaying(false)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    setCurrentX(clientX)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const diff = startX - currentX
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  const handleMouseLeave = () => {
    handleEnd()
  }

  // Calculate discount percentage
  const getDiscountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  // Get card positioning for stacking effect
  const getCardTransform = (index: number) => {
    if (isMobile) {
      return {
        transform: "translateX(0) scale(1)",
        zIndex: 1,
        opacity: 1,
      }
    }

    const diff = index - currentIndex
    const totalCards = plans.length

    let position = diff
    if (diff > totalCards / 2) position = diff - totalCards
    if (diff < -totalCards / 2) position = diff + totalCards

    const maxVisibleCards = totalCards >= 6 ? 5 : totalCards >= 4 ? 3 : totalCards
    const maxSideCards = Math.floor(maxVisibleCards / 2)

    if (position === 0) {
      return {
        transform: "translateX(-50%) scale(1.1)",
        zIndex: 50,
        opacity: 1,
        left: "50%",
      }
    }

    if (position === -1 && maxSideCards >= 1) {
      return {
        transform: "translateX(-50%) scale(0.9)",
        zIndex: 40,
        opacity: 0.9,
        left: maxSideCards === 2 ? "25%" : "20%",
      }
    }

    if (position === -2 && maxSideCards >= 2) {
      return {
        transform: "translateX(-50%) scale(0.8)",
        zIndex: 30,
        opacity: 0.7,
        left: "8%",
      }
    }

    if (position === 1 && maxSideCards >= 1) {
      return {
        transform: "translateX(-50%) scale(0.9)",
        zIndex: 40,
        opacity: 0.9,
        left: maxSideCards === 2 ? "75%" : "80%",
      }
    }

    if (position === 2 && maxSideCards >= 2) {
      return {
        transform: "translateX(-50%) scale(0.8)",
        zIndex: 30,
        opacity: 0.7,
        left: "92%",
      }
    }
    return {
      transform: "translateX(-50%) scale(0.6)",
      zIndex: 1,
      opacity: 0,
      left: "50%",
      pointerEvents: "none" as const,
    }
  }

  return (
    <div className="min-h-screen mt-14 bg-gray-50 overflow-hidden">
      {/* Header Section */}
      <div className="text-center pt-6 pb-4 px-4">
        <div className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-full px-4 py-2 mb-4 shadow-lg">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Trusted by 50,000+ Drivers</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Pre-Trip Vehicle Inspection Plans</h1>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto mb-4">
          Choose the perfect inspection package and drive with confidence. Professional service, guaranteed results.
        </p>

        {/* Trust Indicators */}
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

      {/* Carousel Container */}
      <div className="relative px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          {/* Cards Container */}
          <div
            ref={containerRef}
            className={`relative ${
              isMobile ? "overflow-hidden py-2" : "h-[65vh] py-4 flex items-center justify-center"
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
              // Mobile: Simple slider with swipe
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {plans.map((plan, index) => (
                  <div key={plan.id} className="flex-shrink-0 w-full px-3">
                    <Card
                      className={`relative transition-all duration-500 bg-white shadow-xl border-2 rounded-lg h-[70vh] flex flex-col ${
                        plan.popular ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                      }`}
                    >
                      {/* Discount Badge */}
                      <div className="absolute -top-3 right-4 z-10">
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {getDiscountPercentage(plan.originalPrice, plan.price)}% OFF
                        </div>
                      </div>

                      {plan.popular && (
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
                            <div className="text-left">
                              <div className="text-gray-500 line-through text-sm">
                                ₹{plan.originalPrice.toLocaleString()}
                              </div>
                              <div className="text-gray-600 text-xs">per inspection</div>
                            </div>
                          </div>

                          <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 rounded-full px-3 py-1 border border-green-200">
                            <span className="text-xs font-medium">
                              Save ₹{(plan.originalPrice - plan.price).toLocaleString()}
                            </span>
                          </div>
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
                              <li className="text-xs text-blue-600 ml-7 font-medium">
                                +{plan.features.length - 4} more features available
                              </li>
                            )}
                          </ul>
                        </div>

                        <Button
                          className={`w-full py-3 text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                            plan.popular
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-800 hover:bg-gray-900 text-white"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle plan selection
                          }}
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
              // Desktop: 3D stacking effect with drag
              <div className="relative w-full h-full flex items-center justify-center">
                {plans.map((plan, index) => {
                  const style = getCardTransform(index)
                  const isCenter =
                    Math.abs(index - currentIndex) === 0 || Math.abs(index - currentIndex) === plans.length

                  return (
                    <div
                      key={plan.id}
                      className="absolute w-80 transition-all duration-700 ease-out cursor-pointer"
                      style={style}
                      onClick={() => goToSlide(index)}
                    >
                      <Card
                        className={`h-[55vh] flex flex-col transition-all duration-500 bg-white shadow-2xl border-2 rounded-lg ${
                          plan.popular && isCenter ? "border-blue-500 ring-4 ring-blue-200" : "border-gray-200"
                        }`}
                      >
                        {/* Discount Badge - Only for center card */}
                        {isCenter && (
                          <div className="absolute -top-3 right-6 z-10">
                            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                              {getDiscountPercentage(plan.originalPrice, plan.price)}% OFF
                            </div>
                          </div>
                        )}

                        {plan.popular && isCenter && (
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
                              <div className="text-left">
                                <div className="text-gray-500 line-through text-sm">
                                  ₹{plan.originalPrice.toLocaleString()}
                                </div>
                                <div className="text-gray-600 text-xs">per inspection</div>
                              </div>
                            </div>

                            <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 rounded-full px-3 py-1 border border-green-200">
                              <span className="text-xs font-medium">
                                Save ₹{(plan.originalPrice - plan.price).toLocaleString()}
                              </span>
                            </div>
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
                              plan.popular && isCenter
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-gray-800 hover:bg-gray-900 text-white"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle plan selection
                            }}
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

          {/* Navigation Controls - Buttons on sides of dots */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="bg-white shadow-xl border border-gray-200 rounded-full p-3 hover:bg-gray-50 hover:scale-110 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {plans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-blue-600 w-8" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="bg-white shadow-xl border border-gray-200 rounded-full p-3 hover:bg-gray-50 hover:scale-110 transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-lg text-gray-900">{selectedPlan.name} Plan</h3>
              <p className="text-sm text-gray-600 mb-1">{selectedPlan.description}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xl font-bold text-blue-600">₹{selectedPlan.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{selectedPlan.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  Save ₹{(selectedPlan.originalPrice - selectedPlan.price).toLocaleString()}
                </span>
              </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto rounded-lg">
              Book {selectedPlan.name} Now
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Auto-play control */}
      <div className="text-center mt-2">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-gray-500 hover:text-gray-700 text-sm transition-colors bg-white rounded-full px-3 py-1 shadow-sm"
        >
          {isAutoPlaying ? "⏸ Pause slideshow" : "▶ Resume slideshow"}
        </button>
      </div>
    </div>
  )
}
