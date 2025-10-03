import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import MechanicRoutes from "./MechanicRoutes";


const AppRoutes: React.FC = () => {
  return (
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/mechanic/*" element={<MechanicRoutes />} />
        <Route path="/auth/admin/signup" element={<Navigate to="/auth/admin/login" replace />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
  );
};

export default AppRoutes;


