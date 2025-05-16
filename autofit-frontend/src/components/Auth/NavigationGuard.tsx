import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type NavigationGuardProps = {
  children: React.ReactNode;
};

const NavigationGuard: React.FC<NavigationGuardProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (
      isAuthenticated &&
      user?.role &&
      location.pathname.includes("/auth/") &&
      (location.pathname.includes("login") || location.pathname.includes("signup"))
    ) {
      const defaultRoute =
        user.role === "admin"
          ? "/admin/dashboard"
          : user.role === "user"
          ? "/"
          : "/mechanic/dashboard";
      window.history.pushState(null, "", defaultRoute);
    }
  }, [isAuthenticated, user, location]);

  return <>{children}</>;
};

export default NavigationGuard;