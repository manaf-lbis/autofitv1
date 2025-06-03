import React from "react";
import { motion } from "framer-motion";
import { steps } from "../../utils/RegistrationStepsInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


const ProgressIndicator: React.FC = () => {

 const currentStep =  useSelector((state:RootState)=> state.mechRegistration.currentStep)

  return (
    <div className="px-4 sm:px-0 py-6 sm:py-0 bg-af_darkBlue sm:bg-transparent">

      <div className="sm:hidden flex items-center justify-between relative">
        <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-slate-600 z-0"></div>
        
        {/* Progress line */}
        <motion.div
          className="absolute top-3.5 left-0 h-0.5 bg-gradient-to-r from-white to-slate-300 z-10"
          initial={{ width: "0%" }}
          animate={{ 
            width: currentStep === 0 ? "0%" : 
                   currentStep >= steps.length ? "100%" : 
                   `${(currentStep / (steps.length - 1)) * 100}%` 
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        ></motion.div>

        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;

          return (
            <div key={index} className="flex flex-col items-center relative z-20">
              <motion.div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold transition-all duration-300 shadow-lg
                  ${
                    isCompleted
                      ? "bg-white text-af_darkBlue border-white shadow-white/20"
                      : isCurrent
                      ? "bg-af_darkBlue text-white border-white shadow-white/30"
                      : "bg-af_darkBlue text-slate-400 border-slate-500"
                  }
                `}
                animate={{ 
                  scale: isCurrent ? 1.15 : 1,
                  boxShadow: isCurrent ? "0 0 0 3px rgba(255, 255, 255, 0.2)" : "none"
                }}
                transition={{ duration: 0.25 }}
              >
                {isCompleted ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  index + 1
                )}
              </motion.div>

              <motion.div 
                className="text-[10px] text-slate-300 mt-2 truncate max-w-[60px] text-center font-medium"
                animate={{ 
                  color: isCurrent ? "#ffffff" : "#cbd5e1",
                  fontWeight: isCurrent ? 600 : 500
                }}
              >
                {step.title}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Desktop Layout - Vertical */}
      <div className="hidden sm:block relative">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex items-center mb-8 relative">
              {/* Vertical connecting line */}
              {!isLast && (
                <div className="absolute left-3.5 top-7 w-0.5 h-8 z-0">
                  <div className="w-full h-full bg-slate-600"></div>
                  <motion.div
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-slate-300"
                    initial={{ height: "0%" }}
                    animate={{ 
                      height: currentStep > index ? "100%" : 
                              currentStep === index ? "50%" : "0%" 
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut", delay: index * 0.1 }}
                  ></motion.div>
                </div>
              )}

              {/* Step circle */}
              <motion.div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition-all duration-300 shadow-lg relative z-10
                  ${
                    isCompleted
                      ? "bg-white text-[#1c2b30] border-white shadow-white/20"
                      : isCurrent
                      ? "bg-[#1c2b30] text-white border-white shadow-white/30"
                      : "bg-transparent text-white border-slate-400"
                  }
                `}
                animate={{ 
                  scale: isCurrent ? 1.15 : 1,
                  boxShadow: isCurrent ? "0 0 0 3px rgba(255, 255, 255, 0.2)" : "none"
                }}
                transition={{ duration: 0.25 }}
              >
                {isCompleted ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  index + 1
                )}
              </motion.div>

              {/* Step content */}
              <motion.div 
                className="ml-4 flex flex-col"
                animate={{ 
                  x: isCurrent ? 4 : 0,
                  opacity: isCurrent ? 1 : 0.8
                }}
                transition={{ duration: 0.25 }}
              >
                <div className={`uppercase text-[7px] font-semibold tracking-wide transition-colors duration-300
                  ${isCurrent ? "text-slate-300" : "text-slate-400"}
                `}>
                  STEP {index + 1}
                </div>
                <div className={`uppercase text-[9px] font-bold tracking-wide transition-colors duration-300
                  ${isCurrent ? "text-white" : "text-slate-300"}
                `}>
                  {step.title}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;

