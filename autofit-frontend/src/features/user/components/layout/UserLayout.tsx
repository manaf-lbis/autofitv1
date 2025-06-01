import React from "react";
import {Outlet } from "react-router-dom";
import Navbar from "@/features/user/components/Navbar";


const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
        <Outlet />
    </div>
  );
};

export default MainLayout;


