import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import Home from "@/pages/Mechanic/Home";
import MechanicInitGuard from "@/components/Auth/MechanicInitGuard";
import Registration from "@/pages/Mechanic/Registration";
import RegistrationStatus from "@/features/mechanic/mechanicRegistration/components/RegistrationStatus";


const MechanicRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Routes accessible only after login with role = mechanic */}
      <Route element={<ProtectedRoute allowedRoles={["mechanic"]} />}>
        {/* Main guarded section */}
        <Route element={<MechanicInitGuard />}>
          <Route path="dashboard" element={<Home />} />
        </Route>

        {/* Routes that don't require approval */}
        <Route path="registration" element={<Registration />} />
        <Route path="status" element={<RegistrationStatus />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<>Not Found</>} />
    </Routes>
  );
};

export default MechanicRoutes;

// import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "../components/Routes/ProtectedRoute";
// import Home from "@/pages/Mechanic/Home";
// import MechanicInitGuard from "@/components/Auth/MechanicInitGuard";
// import Registration from "@/pages/Mechanic/Registration";

// const MechanicRoutes: React.FC = () => {
//   return (
//     <Routes>
//       <Route element={<ProtectedRoute allowedRoles={["mechanic"]} />}>
//         <Route path="init" element={<MechanicInitGuard/>} />

//         <Route path="dashboard" element={ <Home/> } />
//         <Route path="registration" element={ <Registration/> } />

//         <Route  path="*" element={<>Not Found</>}></Route>
//       </Route>
//     </Routes>
//   );
// };

// export default MechanicRoutes;
