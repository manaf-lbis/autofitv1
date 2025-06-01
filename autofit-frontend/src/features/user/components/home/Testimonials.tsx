import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import Profile1 from '@/assets/common/dummyProfiles/profile1.jpg'
import Profile2 from '@/assets/common/dummyProfiles/profile2.jpg'
import Profile3 from '@/assets/common/dummyProfiles/profile3.jpg'
import Profile4 from '@/assets/common/dummyProfiles/profile4.jpg'
import Profile5 from '@/assets/common/dummyProfiles/profile5.jpeg'
import Profile6 from '@/assets/common/dummyProfiles/profile6.jpg'


const testimonials = [
  {
    name: "Nazriya Nazeem",
    role: "Movie Artist",
    content:
      "RoadEase saved me when I had a flat tire at midnight. The mechanic arrived in 12 minutes and was incredibly professional!",
    rating: 5,
    avatar: Profile6,
    location: "India,Kerala",
  },
  {
    name: "Mike Chen",
    role: "Business Owner",
    content:
      "The video calling feature helped diagnose my engine issue before the mechanic arrived. Saved me time and money!",
    rating: 5,
    avatar: Profile2,
    location: "San Francisco, CA",
  },
  {
    name: "Emily Davis",
    role: "Road Trip Enthusiast",
    content:
      "Pre-trip checkups give me peace of mind for long journeys. The service is thorough and the mechanics are knowledgeable.",
    rating: 5,
    avatar: Profile3,
    location: "Austin, TX",
  },
  {
    name: "David Wilson",
    role: "Family Man",
    content:
      "When my car broke down with my kids, RoadEase was there within 10 minutes. Truly a lifesaver for families!",
    rating: 5,
    avatar: Profile4,
    location: "Chicago, IL",
  },
  {
    name: "Lisa Rodriguez",
    role: "College Student",
    content:
      "Affordable and reliable! The student discount made it perfect for my budget, and the service was top-notch.",
    rating: 5,
    avatar: Profile5,
    location: "Los Angeles, CA",
  },
  {
    name: "James Thompson",
    role: "Delivery Driver",
    content: "As someone who drives for work, RoadEase keeps me on the road. Quick response times and fair pricing.",
    rating: 5,
    avatar: Profile1,
    location: "Miami, FL",
  },
]

const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let isPaused = false

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += 1

        // Reset scroll when reaching the end
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0
        }
      }
      animationId = requestAnimationFrame(scroll)
    }

    // Start scrolling
    animationId = requestAnimationFrame(scroll)

    // Pause on hover
    const handleMouseEnter = () => {
      isPaused = true
    }
    const handleMouseLeave = () => {
      isPaused = false
    }

    scrollContainer.addEventListener("mouseenter", handleMouseEnter)
    scrollContainer.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer?.removeEventListener("mouseenter", handleMouseEnter)
      scrollContainer?.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Duplicate testimonials for infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            What Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real stories from real people who trust RoadEase</p>
        </motion.div>

        {/* Auto-scrolling testimonials */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden"
            style={{
              scrollBehavior: "auto",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {duplicatedTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-80 bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % testimonials.length) * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Rating Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current mr-1" size={16} />
                  ))}
                </div>

                {/* Testimonial Content */}
                <p className="text-gray-700 leading-relaxed mb-6 text-sm">"{testimonial.content}"</p>

                {/* User Info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3 border-2 border-white shadow-md"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-gray-600 text-xs">{testimonial.role}</div>
                    <div className="text-blue-600 text-xs">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-blue-50/30 to-transparent pointer-events-none z-10" />
        </div>

        {/* Trust indicators */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400 fill-current" size={20} />
            <span className="text-gray-700 font-semibold">4.9/5 Rating</span>
          </div>
          <div className="text-gray-700">•</div>
          <div className="text-gray-700 font-semibold">50,000+ Happy Customers</div>
          <div className="text-gray-700">•</div>
          <div className="text-gray-700 font-semibold">24/7 Support</div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials