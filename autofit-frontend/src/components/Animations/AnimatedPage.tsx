import { motion } from 'framer-motion';
import React from 'react';



const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
  return (

    <motion.div
        className="hide-scrollbar overflow-y-auto w-full h-full"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{
        duration: 0.7,
        ease: [0.25, 0.8, 0.25, 1.1] // ease-in-out with slight bounce
        }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
