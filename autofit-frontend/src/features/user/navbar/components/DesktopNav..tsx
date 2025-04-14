import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const navItems = [{label : "Home",route: '/'}, {label:"Service",route:'/service'}, {label:"About",route:'/about'},{ label:"Contact",route:'contact'}];

const itemVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1, transition: { type: "spring", stiffness: 300 } },
  tap: { scale: 0.95 },
};

const DesktopNav: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [underlineProps, setUnderlineProps] = useState({ left: 0, width: 0 });
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const currentItem = itemRefs.current[activeIndex];
    if (currentItem) {
      setUnderlineProps({
        left: currentItem.offsetLeft,
        width: currentItem.clientWidth,
      });
    }
  }, [activeIndex]);

  return (
    <div className="hidden md:block">
      <ul className="relative flex md:gap-9 lg:gap-16">
        {navItems.map((item, index) => (
          <motion.li
            key={index}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            onClick={() => setActiveIndex(index)}
            variants={itemVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className={`cursor-pointer transition-all duration-300 ${
              activeIndex === index
                ? "text-btn_color"
                : "text-white hover:text-btn_color"
            }`}
          >
            <Link to={item.route}>
              {item.label}
            </Link>
            
          </motion.li>
        ))}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-btn_color"
          animate={{ left: underlineProps.left, width: underlineProps.width }}
          transition={{ type: "spring", stiffness: 200, damping: 40 }}
        />
      </ul>
    </div>
  );
};

export default DesktopNav;