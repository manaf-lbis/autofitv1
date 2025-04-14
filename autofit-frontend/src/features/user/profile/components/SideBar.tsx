import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Wrench, Lock, LogOut, Edit, Car, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "@/features/auth/slices/authSlice"; // Adjust path

const SideBar = () => {
      const navigate = useNavigate();
      const dispatch = useDispatch();

    const navItems = [
        { label: "Home", icon: <Home className="w-6 h-6" />, path: "/" },
        { label: "Profile", icon: <User className="w-6 h-6" />, path: "/profile" },
        { label: "Service History", icon: <Wrench className="w-6 h-6" />, path: "/service-history" },
        { label: "Password", icon: <Lock className="w-6 h-6" />, path: "/password" },
        {
          label: "Logout",
          icon: <LogOut className="w-6 h-6" />,
          onClick: () => {
            dispatch(clearUser());
            navigate("/login");
          },
        },
      ];


  return (
    <>
      <aside className="hidden md:block w-64 h-screen bg-white shadow-md">
            <div className="p-4">
              <nav className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={item.onClick ? item.onClick : () => navigate(item.path)}
                    className={`w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                      window.location.pathname === item.path ? "bg-blue-100 text-blue-600" : ""
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </aside>
    
    </>
  )
}

export default SideBar