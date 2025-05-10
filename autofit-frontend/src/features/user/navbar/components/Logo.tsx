import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import af_Logo from "@/assets/common/af_Logo.png";  
import logoName from "@/assets/common/LogoName.png"; 
import { useNavigate } from "react-router-dom";

const AnimatedLogo: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()

  return (
    <div
      className="w-24 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={()=>navigate('/')}
    >
      <AnimatePresence mode="wait">
        {!isHovered ? (
          <motion.img
            key="combined"
            src={af_Logo}
            alt="combined logo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.3 }}
            className="block"
          />
        ) : (
          <motion.img
            key="plain"
            src={logoName}
            alt="plain logo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="block"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedLogo;