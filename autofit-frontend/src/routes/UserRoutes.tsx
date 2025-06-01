import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import MainLayout from "../features/user/components/layout/UserLayout";
import ProfileLayout from "@/features/user/components/layout/ProfileLayout";
import ServiceHistory from "@/features/user/pages/profile/ServiceHistory";
import ProfilePage from "@/features/user/pages/profile/Profile";
import MyVehicle from "@/features/user/pages/profile/MyVehicle";

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route element={<MainLayout />}>

          <Route element={<ProfileLayout />}>
            <Route path="profile" element={<ProfilePage />}/>
            <Route path="my-vehicles" element={<MyVehicle />} />
            <Route path="service-history" element={<ServiceHistory />} />
            <Route  path="*" element={<>Not Found</>}></Route>
          </Route>




        </Route>
      </Route>
    </Routes>
  );
};

export default UserRoutes;