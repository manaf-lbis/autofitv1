import { DotLottiePlayer } from "@dotlottie/react-player";
import formAnimation from "@/assets/lottieFiles/mechanic/registratioForm.lottie";

import React from 'react'

const RegistrationFormAnimation : React.FC = () => {
  return (
    <div className="w-full">
      <DotLottiePlayer
        src={formAnimation} 
        autoplay
        loop
        className="mx-auto w-full h-auto"
      />
    </div>
  )
}

export default RegistrationFormAnimation