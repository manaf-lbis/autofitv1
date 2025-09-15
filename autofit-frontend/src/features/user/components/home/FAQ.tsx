import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How quickly can I get roadside assistance?",
    answer:
      "Our average response time is under 15 minutes, guaranteed. We have a network of certified mechanics strategically located to ensure the fastest possible response to your location.",
  },
  {
    question: "What types of roadside assistance do you provide?",
    answer:
      "We provide comprehensive roadside assistance including jump starts, tire changes, lockout service, fuel delivery, towing, emergency repairs, and battery replacement.",
  },
  {
    question: "How does the live video calling feature work?",
    answer:
      "Simply tap the video call button to connect with a certified mechanic via HD video call. They can see your vehicle's issue in real-time and provide step-by-step guidance.",
  },
  {
    question: "Can I track my mechanic's location in real-time?",
    answer:
      "Yes! Once assigned, you can track their real-time location on the map within the app and receive live ETA updates as they travel to your location.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "RoadEase covers all major metropolitan areas and highways across the United States. We're continuously expanding our coverage area.",
  },
  {
    question: "Are your mechanics certified and insured?",
    answer:
      "All RoadEase mechanics are ASE certified with minimum 5 years experience. They undergo background checks and continuous training. All services are fully insured.",
  },
]

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-lg">Everything you need to know about RoadEase</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors duration-200"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-gray-500 transition-transform duration-200 ${openFAQ === index ? "rotate-180" : ""}`}
                />
              </button>

              {openFAQ === index && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default FAQ
