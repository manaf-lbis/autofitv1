  // import { Navigate } from "react-router-dom";
  // import { useSelector } from "react-redux";
  // import { RootState } from "../../store/store";
  // import { roleConfig } from "@/utils/roleConfig";

  // const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //   const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  //   if (isAuthenticated && user?.role) {
  //     const defaultRoute = roleConfig[user.role]?.defaultRoute || "/";
  //     console.log(`PublicRoute: Redirecting ${user.role} to ${defaultRoute}`);
  //     return <Navigate to={defaultRoute} replace />;
  //   }

  //   return <>{children}</>;
  // };

  // export default PublicRoute;



  import React from 'react';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { roleConfig } from "@/utils/roleConfig";

const PublicRoute: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  console.log('PublicRoute: isAuthenticated=', isAuthenticated, 'user=', user, 'path=', location.pathname, 'rendering Outlet=', !isAuthenticated || !user?.role);

  if (!isAuthenticated || !user?.role) {
    return <Outlet />;
  }

  const defaultRoute = roleConfig[user.role].defaultRoute;
  console.log('PublicRoute: Redirecting to', defaultRoute);
  return <Navigate to={defaultRoute} replace state={{ from: location }} />;
};

export default PublicRoute;