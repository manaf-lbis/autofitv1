import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import Home from "@/features/mechanic/pages/Home";
import MechanicInitGuard from "@/features/mechanic/components/MechanicInitGuard";
import Registration from '@/features/mechanic/pages/Registration'
import RegistrationStatus from "@/features/mechanic/components/registration/RegistrationStatus";


const MechanicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["mechanic"]} />}>
        <Route element={<MechanicInitGuard />}>
          <Route path="dashboard" element={<Home />} />
        </Route>

        <Route path="registration" element={<Registration />} />
      </Route>

      <Route path="*" element={<>Not Found</>} />
    </Routes>
  );
};

export default MechanicRoutes;
