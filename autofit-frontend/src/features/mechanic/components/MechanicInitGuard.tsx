import React from "react";
import Loading from "../../../components/Animations/PageLoading";
import { Navigate, Outlet } from "react-router-dom"; 
import { useGetMechanicQuery } from "@/features/mechanic/api/registrationApi";
import { useDispatch } from "react-redux";
import RegistrationStatus from "./registration/RegistrationStatus";

const MechanicInitGuard = () => {
  const { data, error, isLoading } = useGetMechanicQuery();
  console.log(data);

  const status = data?.data?.registration?.status;

    if (isLoading) return <Loading />;

    if (!status) return <Navigate to="/mechanic/registration" replace />;
    if (status === "pending" || status === "rejected") return <RegistrationStatus data={data}  />
    if (status === "approved") return <Outlet />;
};

export default MechanicInitGuard;