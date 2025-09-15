
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import PageLoading from "@/components/Animations/PageLoading";

const AdminLayout = lazy(() => import("../features/admin/components/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("@/features/admin/pages/AdminDashboard"));
const UserDashboard = lazy(() => import("@/features/admin/pages/userManagement/UserDashboard"));
const UserDetails = lazy(() => import("@/features/admin/pages/userManagement/UserDetails"));
const NewApplication = lazy(() => import("@/features/admin/pages/mechanicManagement/NewApplication"));
const VerifyNewApplication = lazy(() => import("@/features/admin/pages/mechanicManagement/VerifyNewApplication"));
const MechanicDashboard = lazy(() => import("@/features/admin/pages/mechanicManagement/MechanicDashboard"));
const MechanicDetails = lazy(() => import("@/features/admin/pages/mechanicManagement/MechanicDetails"));
const PretripPlans = lazy(() => import("@/features/admin/pages/services/PretripPlans"));




const AdminRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoading/>}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>

            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="users" element={<UserDashboard />} />
            <Route path="user-details/:id" element={<UserDetails />} />

            <Route path="mechanics" element={<MechanicDashboard />} />
            <Route path="mechanic-details/:id" element={<MechanicDetails />} />

            <Route path="new-application" element={<NewApplication />} />
            <Route path="mechanic-application/:id" element={<VerifyNewApplication />} />

            <Route path="pretrip-plans" element={<PretripPlans />} />

            <Route path="*" element={<>Not Found</>} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
