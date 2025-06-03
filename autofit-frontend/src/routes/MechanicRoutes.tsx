import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import Home from "@/features/mechanic/pages/Home";
import MechanicInitGuard from "@/features/mechanic/components/MechanicInitGuard";
import Registration from '@/features/mechanic/pages/Registration'
import RegistrationStatus from "@/features/mechanic/components/registration/RegistrationStatus";
import MechanicDashboardLayout from "@/features/mechanic/components/Layout";
import Profile from "@/features/mechanic/pages/Profile";


const MechanicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["mechanic"]} />}>
        <Route element={<MechanicInitGuard />}>
        
          <Route element={<MechanicDashboardLayout/>}>
            <Route path="dashboard" element={<>home</>} />
            <Route path="/account" element={<Profile />} />

            
            <Route path="/*" element={<h1>Not Found</h1>} />

          </Route>

        </Route>

        <Route path="registration" element={<Registration />} />
      </Route>

      <Route path="*" element={<>Not Found</>} />
    </Routes>
  );
};

export default MechanicRoutes;
