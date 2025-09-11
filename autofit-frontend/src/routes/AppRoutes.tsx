import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import MechanicRoutes from "./MechanicRoutes";


const AppRoutes: React.FC = () => {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Authenticated Routes */}
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/mechanic/*" element={<MechanicRoutes />} />

        {/* Redirects Admin only have signup */}
        <Route path="/auth/admin/signup" element={<Navigate to="/auth/admin/login" replace />} />

        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
  );
};

export default AppRoutes;


