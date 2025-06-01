import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../components/profile/SideBar";

const ProfileLayout: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh)] bg-gray-50 font-poppins pt-[60px]">
      <SideBar />
      <div className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;