  import React from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import Step1 from "./steps/Step1";
  import Step2 from "./steps/Step2";
  import Step3 from "./steps/Step3";
  import Step4 from "./steps/Step4";
  import { useSelector } from "react-redux";
  import { RootState } from "@/store/store";


  const FormContent: React.FC = () => {

    const {currentStep = 4}  =  useSelector((state:RootState)=>state.mechRegistration)
    const formVariants = {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 },
    };

    const renderStep = () => {
    if (currentStep === 0) return <Step1 />;
    if (currentStep === 1) return <Step2 />;
    if (currentStep === 2) return <Step3 />
    if (currentStep === 3) return <Step4 />
    
    return null;
  };
  
    return (
      <div className="flex-1 p-2 sm:p-5 relative min-h-[360px] flex flex-col">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            variants={formVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 flex flex-col w-full">
              {renderStep()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  export default FormContent;