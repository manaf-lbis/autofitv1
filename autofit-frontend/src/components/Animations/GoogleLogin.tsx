import { DotLottiePlayer } from "@dotlottie/react-player";
import loadingSpinner from "@/assets/lottieFiles/google_loading.lottie";


import React from 'react'

const GoogleLoading : React.FC = () => {
  return (
    <div >
      <DotLottiePlayer
        src={loadingSpinner} 
        autoplay
        loop
        style={{ width: "60px", height: "60px" }} 
      />
    </div>
  )
}

export default GoogleLoading