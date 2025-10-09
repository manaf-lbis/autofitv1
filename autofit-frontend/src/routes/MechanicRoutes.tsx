import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import MechanicInitGuard from "@/features/mechanic/components/MechanicInitGuard";
import MechanicLayout from "@/features/mechanic/components/layout/MechanicLayout";
import MechanicSocketContext from "@/context/MechanicSocketContext";
import PageLoading from "@/components/Animations/PageLoading";
import ChangePasswordPage from "@/components/shared/ChangePasswordPage";
import SocketProvider from "@/context/SocketProvider";

const Registration = lazy(() => import("@/features/mechanic/pages/Registration"));
const Dashboard = lazy(() => import("@/features/mechanic/pages/Dashboard"));
const AccountPage = lazy(() => import("@/features/mechanic/pages/Account"));
const EmergencyDetails = lazy(() => import("@/features/mechanic/pages/RoadsideAssistanceDetails"));
const Messages = lazy(() => import("@/features/mechanic/pages/Messages"));
const PretripCheckup = lazy(() => import("@/features/mechanic/pages/jobs/PretripCheckup"));
const PretripDetails = lazy(() => import("@/features/mechanic/pages/PretripDetails"));
const Earnings = lazy(() => import("@/features/mechanic/pages/Earnings"));
const LiveAssistance = lazy(() => import("@/features/mechanic/pages/jobs/LiveAssistance"));
const RoadsideAssistance = lazy(() => import("@/features/mechanic/pages/jobs/RoadsideAssistance"));
const NotFound = lazy(() => import("@/features/mechanic/pages/NotFound"));

const MechanicRoutes: React.FC = () => {
  return (
    <MechanicSocketContext>
      <SocketProvider>
      <Suspense fallback={<PageLoading/>}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["mechanic"]} />}>
            <Route element={<MechanicInitGuard />}>
              <Route element={<MechanicLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="roadside-assistance/:id/details" element={<EmergencyDetails />} />

                <Route path="account" element={<AccountPage />} />
                <Route path="messages" element={<Messages />} />
                <Route path="earnings" element={<Earnings />} />
                <Route path="change-password" element={<ChangePasswordPage />} />

                <Route path="jobs/pre-trip-checkup" element={<PretripCheckup />} />
                <Route path="jobs/live-assistance" element={<LiveAssistance />} />
                <Route path="jobs/roadside-assistance" element={<RoadsideAssistance />} />
                <Route path="pre-trip-checkup/:id/details" element={<PretripDetails />} />

                <Route path="/*" element={<NotFound />} />
              </Route>
            </Route>

            <Route path="registration" element={<Registration />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </SocketProvider>
    </MechanicSocketContext>
  );
};

export default MechanicRoutes;




