import React from "react";
import Lottie from "lottie-react";
import formAnimation from "@/assets/lottieFiles/mechanic/registratioForm.json";

const RegistrationFormAnimation: React.FC = () => {
  return (
    <div className="w-full">
      <Lottie
        animationData={formAnimation}
        loop={true}
        className="mx-auto w-full h-auto"
      />
    </div>
  );
};

export default RegistrationFormAnimation;
