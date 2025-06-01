import React, { useState } from 'react'
import { motion,AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'


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
  ];


const FAQ = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <>
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about RoadEase
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <motion.button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/30 transition-colors"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown
                      size={20}
                      className="text-gray-600 flex-shrink-0"
                    />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQ