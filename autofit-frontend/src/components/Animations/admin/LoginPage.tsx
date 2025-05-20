import { DotLottiePlayer } from "@dotlottie/react-player";
import adminLoginPage from "@/assets/lottieFiles/admin/adminLoginPage.lottie";


import React from 'react'

const AdminLoginpageAnimation : React.FC = () => {
  return (
    <div >
      <DotLottiePlayer
        src={adminLoginPage} 
        autoplay
        loop
        className="mx-auto max-h-[300px]"
      />
    </div>
  )
}

export default AdminLoginpageAnimation