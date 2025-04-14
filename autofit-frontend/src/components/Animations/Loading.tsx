import { DotLottiePlayer } from "@dotlottie/react-player";
import loadingSpinner from "@/assets/lottieFiles/loadingSpinner.lottie";


import React from 'react'

const Loading : React.FC = () => {
  return (
    <div className="w-64 h-64">
      <DotLottiePlayer
        src={loadingSpinner} 
        autoplay
        loop
        style={{ width: "100px", height: "100px" }} 
      />
    </div>
  )
}

export default Loading