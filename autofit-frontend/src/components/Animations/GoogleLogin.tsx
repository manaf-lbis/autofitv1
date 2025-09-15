import React from "react";
import Lottie from "lottie-react";
import loadingSpinner from "@/assets/lottieFiles/google_loading.json";

const GoogleLoading: React.FC = () => {
  return (
    <div>
      <Lottie
        animationData={loadingSpinner}
        loop={true}
        style={{ width: "90px", height: "100px" }}
      />
    </div>
  );
};

export default GoogleLoading;
