import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import UserSocketContext from "@/context/UserSocketContext";
import PageLoading from "@/components/Animations/PageLoading";
import ChangePasswordPage from "@/components/shared/ChangePasswordPage";
import SocketProvider from "@/context/SocketProvider";

const MainLayout = lazy(() => import("../features/user/components/layout/UserLayout"));
const ProfileLayout = lazy(() => import("@/features/user/components/layout/ProfileLayout"));
const ServiceHistory = lazy(() => import("@/features/user/pages/profile/ServiceHistory"));
const ProfilePage = lazy(() => import("@/features/user/pages/profile/Profile"));
const MyVehicle = lazy(() => import("@/features/user/pages/profile/MyVehicle"));
const MechanicBooking = lazy(() => import("@/features/user/pages/roadsideAssistance/MechanicBooking"));
const BookingSuccessPage = lazy(() => import("@/features/user/pages/roadsideAssistance/RoadsideDetails"));
const PaymentStatusPage = lazy(() => import("@/features/user/pages/roadsideAssistance/PaymentStatusPage"));
const PretripCheckupBooking = lazy(() => import("@/features/user/pages/PreTripCheckup/PretripCheckupBooking"));
const PretripDetails = lazy(() => import("@/features/user/pages/PreTripCheckup/PretripDetails"));
const LiveAssistanceBookingPage = lazy(() => import("@/features/user/pages/liveAssistance/LiveAssistanceBookingPage"));
const BookingDetailsPage = lazy(() => import("@/features/user/pages/liveAssistance/BookingDetails"));
const Checkout = lazy(() => import("@/features/user/paymentAndCheckout/Checkout"));




const UserRoutes: React.FC = () => {
  return (
    <UserSocketContext>
      <SocketProvider>
      <Suspense fallback={<PageLoading/>}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route element={<MainLayout />}>
              
              <Route element={<ProfileLayout />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="my-vehicles" element={<MyVehicle />} />
                <Route path="service-history" element={<ServiceHistory />} />
                <Route path="pretrip-checkup/:id/details" element={<PretripDetails />} />
                <Route path="live-assistance/:id/details" element={<BookingDetailsPage />} />
                <Route path="roadside-assistance/:id/details" element={<BookingSuccessPage />} />
                <Route path="change-password" element={<ChangePasswordPage/>} />

                <Route path="*" element={<>Not Found</>} />
              </Route>

              <Route path="roadside-assistance/mechanic-booking" element={<MechanicBooking />} />
              <Route path="live-assistance/booking" element={<LiveAssistanceBookingPage />} />
              <Route path="pretrip-checkup/booking/:id" element={<PretripCheckupBooking />} />
              <Route path=":service/checkout/:id" element={<Checkout />} />
            </Route>

            <Route path="payment/status/:status" element={<PaymentStatusPage />} />
          </Route>
        </Routes>
      </Suspense>
      </SocketProvider>
    </UserSocketContext>
  );
};

export default UserRoutes;
