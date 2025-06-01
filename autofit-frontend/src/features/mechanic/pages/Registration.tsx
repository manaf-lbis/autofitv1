import { motion } from "framer-motion";
import FormAnimation from "@/components/Animations/mechanic/Form";
import ProgressIndicator from "../components/registration/Combined";
import FormContent from "../components/registration/FormComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import FormVerifying from "@/components/Animations/formVerifying";
import RegistrationStatus from "../components/registration/RegistrationStatus";

const Registration: React.FC = () => {
  const drawerVariants = {
    hidden: { y: "100%" },
    visible: { y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  const { isLoading ,currentStep } = useSelector(
    (state: RootState) => state.mechRegistration
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-0 sm:p-4 bg-[#f2f2fa]">

      <motion.div
        className="sm:hidden w-full max-w-3xl bg-white rounded-t-xl shadow-lg overflow-hidden flex flex-col fixed bottom-0 left-0 right-0 min-h-[50vh] max-h-[90vh]"
        style={{
          height:
            "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
        }}
        role="main"
        aria-label="Multi-step form"
        variants={drawerVariants}
        initial="hidden"
        animate="visible"
      >

        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>


        <div className="sticky top-0 z-10 border-b">
          <ProgressIndicator />
        </div>


        <div className="flex-1 flex items-center justify-center">
          {isLoading ? <FormVerifying /> : <FormContent />}
        </div>
      </motion.div>


      <motion.div
        className="hidden sm:flex w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden flex-row"
        role="main"
        aria-label="Multi-step form"
      >

        <div className="flex flex-col w-52 rounded-l-xl p-7 shrink-0 bg-af_darkBlue">
          <ProgressIndicator />
          <div className="mt-auto rounded-md">
            <FormAnimation />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {isLoading ? <FormVerifying /> : <FormContent />}
        </div>
      </motion.div>
    </div>
  );
};

export default Registration;
