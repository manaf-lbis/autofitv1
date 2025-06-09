import React from "react";
import { Navigate, Outlet } from "react-router-dom"; 
import RegistrationStatus from "./registration/RegistrationStatus";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const MechanicInitGuard:React.FC = () => {

  const user = useSelector((state:RootState)=>state.auth.user)

    if (user?.profileStatus === null) return <Navigate to="/mechanic/registration" replace />;
    if (user?.profileStatus === 'pending' || user?.profileStatus === 'rejected') return <RegistrationStatus />
    if (user?.profileStatus === "approved") return <Outlet />;
};

export default MechanicInitGuard;