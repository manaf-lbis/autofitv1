import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/features/user/components/Navbar";
import { useLogoutHandler } from "@/hooks/useLogoutHandler";
import { initSocket } from "@/lib/socket";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const MainLayout: React.FC = () => {
  const { handleLogout } = useLogoutHandler();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    let socket: any;

    if (isAuthenticated) {
      socket = initSocket();
      socket.on("forceLogout", (data: any) => {
        toast.error(data.message);
        handleLogout("user");
      });

    }

    return () => {
      if (socket) {
        socket.off("forceLogout");
      }
    };
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
