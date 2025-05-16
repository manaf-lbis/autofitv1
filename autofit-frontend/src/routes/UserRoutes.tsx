import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import MainLayout from "../pages/User/Layout";
import ProfileLayout from "../features/user/profile/layout/ProfileLayout";
import ProfilePage from "../pages/User/profile/Profile";
import ServiceHistory from "../pages/User/profile/ServiceHistory";

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route element={<MainLayout />}>
          <Route element={<ProfileLayout />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="service-history" element={<ServiceHistory />} />

            <Route  path="*" element={<>Not Found</>}></Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes;