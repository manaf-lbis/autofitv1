import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import MainLayout from "../features/user/components/layout/UserLayout";
import ProfileLayout from "@/features/user/components/layout/ProfileLayout";
import ServiceHistory from "@/features/user/pages/profile/ServiceHistory";
import ProfilePage from "@/features/user/pages/profile/Profile";
import MyVehicle from "@/features/user/pages/profile/MyVehicle";
import MechanicBooking from "@/features/user/pages/roadsideAssistance/MechanicBooking";
import BookingSuccessPage from "@/features/user/pages/roadsideAssistance/RoadsideDetails";
import PaymentPage from "@/features/user/pages/profile/PaymentPage";
import PaymentStatusPage from "@/features/user/pages/profile/PaymentStatusPage";
import UserSocketContext from "@/context/UserSocketContext";

const UserRoutes: React.FC = () => {
  return (
    <UserSocketContext>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route element={<MainLayout />}>
            <Route element={<ProfileLayout />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="my-vehicles" element={<MyVehicle />} />
              <Route path="service-history" element={<ServiceHistory />} />

              <Route path="*" element={<>Not Found</>}></Route>
            </Route>

            <Route path="roadside-assistance/mechanic-booking" element={<MechanicBooking />} />
            <Route path="roadside-assistance/:id/details" element={<BookingSuccessPage />} />
          </Route>

          <Route path="payment/status/:status" element={<PaymentStatusPage />} />
          <Route path="payment/:id" element={<PaymentPage />} />
          
        </Route>
      </Routes>
    </UserSocketContext>
  );
};

export default UserRoutes;
