import React from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { roleConfig } from "@/utils/roleConfig";

const PublicRoute: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user?.role) {
    return <Outlet />;
  }

  const defaultRoute = roleConfig[user.role].defaultRoute;
  return <Navigate to={defaultRoute} replace state={{ from: location }} />;
};

export default PublicRoute;