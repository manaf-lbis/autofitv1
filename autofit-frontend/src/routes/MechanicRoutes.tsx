import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import Home from "@/pages/Mechanic/Home";
import MechanicInitGuard from "@/components/Auth/MechanicInitGuard";
import Registration from "@/pages/Mechanic/Registration";
import RegistrationStatus from "@/features/mechanic/mechanicRegistration/components/RegistrationStatus";


const MechanicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["mechanic"]} />}>
        <Route element={<MechanicInitGuard />}>
          <Route path="dashboard" element={<Home />} />
        </Route>

        <Route path="registration" element={<Registration />} />
        <Route path="status" element={<RegistrationStatus />} />
      </Route>

      <Route path="*" element={<>Not Found</>} />
    </Routes>
  );
};

export default MechanicRoutes;
