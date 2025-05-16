import { Routes, Route } from "react-router-dom";
import PublicRoute from "../components/Routes/PublicRoute";
import RedirectToAuth from "../components/Auth/RedirectToAuth";
import MainLayout from "../pages/User/Layout";
import Home from "../pages/User/Home";
import Service from "../pages/User/Service";
import RoleLoginPage from "../features/auth/Pages/RoleLoginPage";
import RoleSignupPage from "../features/auth/Pages/RoleSignupPage";
import RoleForgotPassword from "../features/auth/Pages/RoleForgotPassword";

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/service" element={<Service />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/auth/:role/login" element={<RoleLoginPage />} />
        <Route path="/auth/:role/signup" element={<RoleSignupPage />} />
        <Route path="/auth/:role/forgot-password" element={<RoleForgotPassword />} />
        <Route path="/:role/login" element={<RedirectToAuth type="login" />} />
        <Route path="/:role/signup" element={<RedirectToAuth type="signup" />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;