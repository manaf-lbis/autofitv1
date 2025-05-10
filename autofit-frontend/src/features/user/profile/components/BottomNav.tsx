import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Wrench, Lock, LogOut, Edit, Car, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/features/auth/slices/authSlice"; 
import { useNavigate } from "react-router-dom";


const BottomNav = () => {
    const dispatch = useDispatch();
      const navigate = useNavigate();
    

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
            navigate("/user/login");
          },
        },
      ];


  return (
    <>
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around items-center p-2 z-[51]">
            {navItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={item.onClick ? item.onClick : () => navigate(item.path)}
                className={`flex flex-col items-center p-2 rounded-lg text-gray-700 hover:text-blue-600 transition-colors ${
                  window.location.pathname === item.path ? "text-blue-600" : ""
                }`}
                whileTap={{ scale: 0.9 }}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </motion.button>
            ))}
          </nav>
    
    </>
  )
}

export default BottomNav