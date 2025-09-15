import React from "react";
import Lottie from "lottie-react";
import adminLoginPage from "@/assets/lottieFiles/admin/adminLoginPage.json";

const AdminLoginpageAnimation: React.FC = () => {
  return (
    <div className="mx-auto max-h-[300px]">
      <Lottie
        animationData={adminLoginPage}
        loop={true}
        style={{ height: "100%", width: "100%" }} 
      />
    </div>
  );
};

export default AdminLoginpageAnimation;