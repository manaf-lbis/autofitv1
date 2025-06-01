import React from "react";
import { motion } from "framer-motion";
import {
  PhoneCall,
  MessageSquare,
  CreditCard,
  Check,
  ArrowRight,
} from "lucide-react";

const HowItWorks = () => {
  return (
    <>
      <section
        id="how-it-works"
        className="py-20 bg-white relative"
        style={{ minHeight: "700px" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              How It{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get professional roadside assistance in three simple steps with
              our streamlined process
            </p>
          </motion.div>

          {/* Process Flow */}
          <div className="relative">
            <div className="grid lg:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Request Assistance",
                  description:
                    "Tap the emergency button, describe your situation, and share your location",
                  icon: PhoneCall,
                  details: [
                    "One-tap emergency button",
                    "Smart location detection",
                    "Describe your issue clearly",
                    "Instant mechanic dispatch",
                  ],
                  process:
                    "Your request is immediately processed and the nearest certified mechanic is notified",
                },
                {
                  step: "02",
                  title: "Track & Communicate",
                  description:
                    "Watch real-time location, receive updates, and communicate directly",
                  icon: MessageSquare,
                  details: [
                    "Real-time GPS tracking",
                    "Live ETA updates",
                    "Direct messaging with mechanic",
                    "Progress notifications",
                  ],
                  process:
                    "Stay informed with live tracking and direct communication throughout the service",
                },
                {
                  step: "03",
                  title: "Service & Payment",
                  description:
                    "Receive professional help and complete secure payment",
                  icon: CreditCard,
                  details: [
                    "Certified mechanic arrives",
                    "Professional service delivery",
                    "Quality guarantee",
                    "Secure payment processing",
                  ],
                  process:
                    "Get back on the road safely with guaranteed quality service and seamless payment",
                },
              ].map((item, index) => {
                // Assign static Tailwind classes based on index
                const bgColor =
                  index === 0
                    ? "bg-blue-500"
                    : index === 1
                    ? "bg-teal-500"
                    : "bg-purple-500";
                const lightBgColor =
                  index === 0
                    ? "bg-blue-100"
                    : index === 1
                    ? "bg-teal-100"
                    : "bg-purple-100";
                const textColor =
                  index === 0
                    ? "text-blue-600"
                    : index === 1
                    ? "text-teal-600"
                    : "text-purple-600";
                const borderColor =
                  index === 0
                    ? "border-blue-100"
                    : index === 1
                    ? "border-teal-100"
                    : "border-purple-100";

                return (
                  <motion.div
                    key={index}
                    className="relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    {/* Step Number Circle */}
                    <div className="flex justify-center mb-6">
                      <div
                        className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center shadow-lg relative z-10`}
                      >
                        <span className="text-white font-bold text-lg">
                          {item.step}
                        </span>
                      </div>
                    </div>

                    {/* Main Card */}
                    <motion.div
                      className="backdrop-blur-2xl bg-white/60 rounded-2xl p-6 border border-white/60 shadow-xl hover:shadow-2xl transition-all group"
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      {/* Icon and Title */}
                      <div className="text-center mb-4">
                        <div
                          className={`w-12 h-12 ${lightBgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}
                        >
                          <item.icon className={`${textColor}`} size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>

                      {/* Process Details */}
                      <div className="space-y-2 mb-4">
                        {item.details.map((detail, detailIndex) => (
                          <motion.div
                            key={detailIndex}
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: index * 0.2 + detailIndex * 0.1,
                            }}
                          >
                            <Check
                              className="text-green-500 flex-shrink-0"
                              size={14}
                            />
                            <span className="text-sm text-gray-600">
                              {detail}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Process Explanation */}
                      <div
                        className={`${lightBgColor} rounded-lg p-3 border ${borderColor}`}
                      >
                        <p className="text-sm text-gray-700 italic">
                          {item.process}
                        </p>
                      </div>
                    </motion.div>

                    {/* Arrow for desktop */}
                    {index < 2 && (
                      <motion.div
                        className="hidden lg:block absolute top-8 -right-4 z-20"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.5 }}
                      >
                        <ArrowRight className="text-gray-400" size={24} />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Process Summary */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="backdrop-blur-2xl bg-white/50 rounded-2xl p-6 border border-white/60 shadow-lg inline-block">
              <div className="flex items-center justify-center gap-6 text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span>Request</span>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-500 rounded-full" />
                  <span>Track</span>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span>Complete</span>
                </div>
              </div>
              <p className="text-gray-600 mt-2">
                Average completion time: 15-30 minutes
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
