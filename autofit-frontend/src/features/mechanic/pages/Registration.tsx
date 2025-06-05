import { motion } from "framer-motion";
import FormAnimation from "@/components/Animations/mechanic/RegistrationForm";
import ProgressIndicator from "../components/registration/ProgressIndicator";
import FormContent from "../components/registration/FormComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import FormVerifying from "@/components/Animations/formVerifying";
import AnimatedLogo from "@/features/user/components/AnimatedLogo";
import LogoutButton from "../components/LogoutButton";

const Registration: React.FC = () => {
  const drawerVariants = {
    hidden: { y: "100%" },
    visible: { y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  const { isLoading } = useSelector((state: RootState) => state.mechRegistration);

  return (
    <div className="h-screen w-full flex flex-col bg-[#f2f2fa] overflow-hidden">

      <nav className="flex items-center justify-between p-4 shadow-md bg-[#f2f2fa] shrink-0">
        <AnimatedLogo />
        <LogoutButton />
      </nav>

      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <motion.div
          className="sm:hidden w-full max-w-3xl bg-white rounded-t-xl shadow-lg overflow-hidden flex flex-col fixed bottom-0 left-0 right-0"
          style={{
            height: "calc(100vh - 64px)", 
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

          <div className="sticky top-0 z-10 border-b bg-white">
            <ProgressIndicator />
          </div>

          <div className="flex-1 flex items-center justify-center">
            {isLoading ? <FormVerifying /> : <FormContent />}
          </div>
        </motion.div>


        <div className="hidden sm:flex w-full max-w-3xl h-[500px] bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col w-52 rounded-l-xl p-7 pt-14 shrink-0 bg-af_darkBlue">
            <ProgressIndicator />
            <div className="mt-auto">
              <FormAnimation />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {isLoading ? <FormVerifying /> : <FormContent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
