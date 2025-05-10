import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HomeIcon, Wrench, Info, Mail, LogIn } from "lucide-react"; // adjust your icon imports
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Home", icon: HomeIcon , route:'/'},
  { label: "Service", icon: Wrench ,route:'/service'},
  { label: "About", icon: Info ,route:'/about'},
  { label: "Contact", icon: Mail ,route:'/contact'},
  { label: "Start", icon: LogIn, route:'/user/login' },
];

const BottomNav: React.FC = () => {

  const [selected, setSelected] = useState(0);
  const [indicatorProps, setIndicatorProps] = useState({ left: 0, width: 0 });
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const userState = useSelector((store:RootState)=> store.auth)
  let filteredNavItems = userState.isAuthenticated ? navItems.filter((ele)=>ele.label !== 'Start') : navItems

  useEffect(() => {
    const currentRef = itemRefs.current[selected];
    if (currentRef) {
      setIndicatorProps({
        left: currentRef.offsetLeft,
        width: currentRef.clientWidth,
      });
    }
  }, [selected]);



  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-14 bg-white flex items-center shadow-md md:hidden">
      <div className="container mx-auto px-4">

        <ul className="relative flex justify-around w-full">
          {

          
            filteredNavItems.map((item, index) => {
            const Icon = item.icon;
            return (

              <li key={index} ref={(el) => { itemRefs.current[index] = el }} onClick={() => setSelected(index)}  >

                <Link to={item.route} className="flex flex-col items-center cursor-pointer p-2">
                  <Icon   className={`w-5 h-5 transition-colors duration-300 ${selected === index ? "text-btn_color" : "text-af_darkBlue"}`} />

                  <span className={`text-xs mt-1 transition-colors duration-300 ${
                      selected === index ? "text-btn_color" : "text-af_darkBlue"
                    }`}
                  >
                    {item.label}
                  </span>

                </Link>

              </li>

            );
          })}
          <motion.div
            className="absolute bottom-0 h-0.5 bg-btn_color"
            animate={{ left: indicatorProps.left, width: indicatorProps.width }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </ul>

      </div>
    </nav>
  );
};

export default BottomNav;