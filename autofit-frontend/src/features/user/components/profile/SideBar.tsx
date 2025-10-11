import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Wrench, CarFront, ChevronRight,LockIcon } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"


const navItems = [
  { label: "Profile", icon: User, path: "/user/profile", },
  { label: "My Vehicle", icon: CarFront, path: "/user/my-vehicles" },
  { label: "Service History", icon: Wrench, path: "/user/service-history" },
  { label: "Password", icon: LockIcon, path: "/user/change-password" },
  
]

const ModernProfileSidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleClick = (item: (typeof navItems)[number]) => {
   navigate(item.path)
  }

  const activeIndex = navItems.findIndex((item) => item.path === location.pathname)

  return (
    <>

      <aside className="hidden lg:block w-72 h-auto bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-10 right-10 w-32 h-32 bg-blue-500/10 backdrop-blur-3xl rounded-full border border-blue-200/30"
            animate={{
              x: [0, 20, 0],
              y: [0, -15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-24 h-24 bg-violet-500/10 backdrop-blur-3xl rounded-full border border-violet-200/30"
            animate={{
              x: [0, -15, 0],
              y: [0, 10, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 h-full flex flex-col p-4">
          {/* Navigation */}
          <motion.nav
            className="flex-1 space-y-1 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {navItems.map((item, idx) => {
              const isActive = idx === activeIndex
              const isHovered = hoveredIndex === idx
              const Icon = item.icon

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleClick(item)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group relative ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white/40 backdrop-blur-xl border border-white/60 hover:bg-white/60 hover:border-white/80 text-gray-700 hover:text-blue-600"
                  }`}
                  whileHover={{ scale: 1.01, x: isActive ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }`}
                      whileHover={{ rotate: isActive ? 0 : 3 }}
                    >
                      <Icon size={18} />
                    </motion.div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Arrow */}
                    <motion.div
                      className={`transition-all duration-300 ${
                        isActive || isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                      }`}
                    >
                      <ChevronRight size={14} className={isActive ? "text-white/70" : "text-gray-400"} />
                    </motion.div>
                  </div>
                </motion.button>
              )
            })}
          </motion.nav>

          {/* Bottom Section */}
         
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <AnimatePresence>
        <motion.nav
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-white/60 shadow-2xl z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-around items-center py-2 px-4">
            {navItems.slice(0, 5).map((item, idx) => {
              const isActive = idx === activeIndex
              const Icon = item.icon

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleClick(item)}
                  className="flex flex-col items-center relative"
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Active background */}
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active"
                      className="absolute -top-1 w-12 h-12 bg-blue-100 rounded-2xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <motion.div
                    className={`relative z-10 p-2 rounded-xl transition-all duration-300 ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon size={24} />
                  </motion.div>

                  <span
                    className={`text-xs font-medium mt-1 transition-colors duration-300 ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Home indicator for iOS-like feel */}
          <div className="flex justify-center pb-2">
            <div className="w-32 h-1 bg-gray-300 rounded-full" />
          </div>
        </motion.nav>
      </AnimatePresence>
    </>
  )
}

export default ModernProfileSidebar


