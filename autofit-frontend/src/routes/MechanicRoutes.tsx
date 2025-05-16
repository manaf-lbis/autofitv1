import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import Home from "@/pages/Mechanic/Home";

const MechanicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["mechanic"]} />}>
        <Route path="dashboard" element={ <Home/> } />

        <Route  path="*" element={<>Not Found</>}></Route>
      </Route>
    </Routes>
  );
};

export default MechanicRoutes;