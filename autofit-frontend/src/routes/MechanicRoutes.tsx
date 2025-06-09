import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import MechanicInitGuard from "@/features/mechanic/components/MechanicInitGuard";
import Registration from "@/features/mechanic/pages/Registration";
import MechanicLayout from "@/features/mechanic/components/layout/MechanicLayout";
import Dashboard from "@/features/mechanic/pages/Dashboard";
import AccountPage from "@/features/mechanic/pages/Account";


const MechanicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["mechanic"]} />}>
        <Route element={<MechanicInitGuard />}>
          <Route element={<MechanicLayout />}>
            <Route path="dashboard" element={<Dashboard/>} />
            <Route path="account" element={<AccountPage />} />
            

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
