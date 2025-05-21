import React from "react";
import { Outlet } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import BottomNav from "../components/BottomNav";
import SideBar from "../components/SideBar";

const ProfileLayout: React.FC = () => {

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-poppins mt-14 ">
      <SideBar />
      <div className="flex-1 p-6 overflow-y-auto ">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfileLayout;