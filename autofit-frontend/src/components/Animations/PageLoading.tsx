import { DotLottiePlayer } from "@dotlottie/react-player";
import carLoading from "@/assets/lottieFiles/carLoading.lottie";
import React from "react";


const PageLoading: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* App Logo/Name */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
          AutoFit
        </h1>
      </div>

      {/* Car Animation */}
      <div className="mb-6">
        <DotLottiePlayer
          src={carLoading}
          autoplay
          loop
          style={{ width: "140px", height: "140px" }}
        />
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-gray-600 text-lg font-medium mb-2">
          Starting your engine...
        </p>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      {/* Optional tagline */}
      <div className="absolute bottom-12">
        <p className="text-sm text-gray-400 font-light">
          Your automotive companion
        </p>
      </div>
    </div>
  );
};

export default PageLoading;