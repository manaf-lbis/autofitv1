import React from "react";
import { Outlet } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import BottomNav from "../components/BottomNav";
import SideBar from "../components/SideBar";

const ProfileLayout: React.FC = () => {

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-poppins l ">
      <SideBar />
      <main className="flex-1 p-6 overflow-y-auto ">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default ProfileLayout;