import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";
import { roleConfig } from "@/utils/roleConfig";

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const currentPath = window.location.pathname;

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const config = roleConfig[user.role];
      const allowedRoutes = config.allowedRoutes;
      const defaultRoute = config.defaultRoute;

      if (!allowedRoutes.includes(currentPath)) {
        navigate(defaultRoute, { replace: true });
      }
    }
  }, [user, isAuthenticated, navigate, currentPath]);

  return <>{children}</>;
};

export default AuthWrapper;