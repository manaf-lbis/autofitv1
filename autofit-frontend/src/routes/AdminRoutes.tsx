import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import AdminLayout from "../features/admin/components/layout/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import UserDashboard from "@/features/admin/pages/userManagement/UserDashboard";
import UserDetails from "@/features/admin/pages/userManagement/UserDetails";
import NewApplication from "@/features/admin/pages/mechanicManagement/NewApplication";
import VerifyNewApplication from "@/features/admin/pages/mechanicManagement/VerifyNewApplication";
import MechanicDashboard from "@/features/admin/pages/mechanicManagement/MechanicDashboard";
import MechanicDetails from "@/features/admin/pages/mechanicManagement/MechanicDetails";
import PretripPlans from "@/features/admin/pages/services/PretripPlans";

const AdminRoutes: React.FC = () => {
  return (
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserDashboard />} />
            <Route path="user-details/:id" element={<UserDetails />} />

            <Route path="mechanics" element={<MechanicDashboard/>} />
            <Route path="mechanic-details/:id" element={<MechanicDetails/>} />

            <Route path="new-application" element={<NewApplication/>} />
            <Route path="mechanic-application/:id" element={<VerifyNewApplication/>} />

            <Route path="/pretrip-plans" element={<PretripPlans/>} />



            <Route  path="*" element={<>Not Found</>}></Route>
          </Route>
        </Route>
      </Routes>
  );
};

export default AdminRoutes;