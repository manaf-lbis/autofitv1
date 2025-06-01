import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import AdminLayout from "../features/admin/components/layout/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import UserDashboard from "@/features/admin/pages/userManagement/Dashboard";

const AdminRoutes: React.FC = () => {
  return (
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserDashboard />} />

            <Route  path="*" element={<>Not Found</>}></Route>
          </Route>
        </Route>
      </Routes>
  );
};

export default AdminRoutes;