import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import MechanicInitGuard from "@/features/mechanic/components/MechanicInitGuard";
import Registration from "@/features/mechanic/pages/Registration";
import MechanicLayout from "@/features/mechanic/components/layout/MechanicLayout";
import Dashboard from "@/features/mechanic/pages/Dashboard";
import AccountPage from "@/features/mechanic/pages/Account";
import MechanicSocketContext from "@/context/MechanicSocketContext";
import EmergencyDetails from "@/features/mechanic/pages/RoadsideAssistanceDetails";
import Messages from "@/features/mechanic/pages/Messages";
import PretripCheckup from "@/features/mechanic/pages/jobs/PretripCheckup";
import NotFound from "@/features/mechanic/pages/NotFound";
import PretripDetails from "@/features/mechanic/pages/PretripDetails";
import Earnings from "@/features/mechanic/pages/Earnings";
import { LiveAssistance } from "@/features/mechanic/pages/jobs/LiveAssistance";
import RoadsideAssistance from "@/features/mechanic/pages/jobs/RoadsideAssistance";



const MechanicRoutes: React.FC = () => {
  return (
    <MechanicSocketContext>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["mechanic"]} />}>
          <Route element={<MechanicInitGuard />}>
            <Route element={<MechanicLayout />}>
              <Route path="dashboard" element={<Dashboard/>} />
              <Route path="roadside-assistance/:id/details" element={<EmergencyDetails/>} />


              <Route path="account" element={<AccountPage />} />
              <Route path="messages" element={<Messages/>} />
              <Route path="earnings" element={<Earnings/>} />
              
              <Route path="jobs/pre-trip-checkup" element={<PretripCheckup/>} />
              <Route path="jobs/live-assistance" element={<LiveAssistance/>} />
              <Route path="jobs/roadside-assistance" element={<RoadsideAssistance/>} />
              <Route path="pre-trip-checkup/:id/details" element={<PretripDetails/>} />

              
              <Route path="/*" element={<NotFound/>} />
            </Route>

          </Route>

          <Route path="registration" element={<Registration />} />
        </Route>

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </MechanicSocketContext>
  );
};

export default MechanicRoutes;
