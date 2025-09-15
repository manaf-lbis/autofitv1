import React from "react";
import Lottie from "lottie-react";
import loading from "@/assets/lottieFiles/formVerifying.json";

const FormVerifying: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
      <Lottie
        animationData={loading}
        loop={true}
        style={{ width: "200px", height: "200px" }}
      />
      <h5 className="text-center text-lg font-medium text-gray-700">
        We're verifying your details...
      </h5>
    </div>
  );
};

export default FormVerifying;
