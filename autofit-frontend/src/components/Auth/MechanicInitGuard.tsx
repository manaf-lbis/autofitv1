import React from "react";
import Loading from "../Animations/PageLoading";
import { Navigate, Outlet } from "react-router-dom"; 
import { useGetMechanicQuery } from "@/features/mechanic/mechanicRegistration/api/registrationApi";
import { useDispatch } from "react-redux";

const MechanicInitGuard = () => {
  const { data, error, isLoading } = useGetMechanicQuery();
  const dispatch = useDispatch();

  const status = data?.data?.registration?.status;

    if (isLoading) return <Loading />;

    if (!status) return <Navigate to="/mechanic/registration" replace />;
    if (status === "pending") return <Navigate to="/mechanic/status" replace />;
    if (status === "approved") return <Outlet />;
};

export default MechanicInitGuard;