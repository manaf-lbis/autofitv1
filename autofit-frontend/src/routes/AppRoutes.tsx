import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import PageLoading from "@/components/Animations/PageLoading";

const PublicRoutes = lazy(() => import("./PublicRoutes"));
const UserRoutes = lazy(() => import("./UserRoutes"));
const AdminRoutes = lazy(() => import("./AdminRoutes"));
const MechanicRoutes = lazy(() => import("./MechanicRoutes"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoading/>}>
      <Routes>

        <Route path="/*" element={<PublicRoutes />} />

        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/mechanic/*" element={<MechanicRoutes />} />


        <Route
          path="/auth/admin/signup"
          element={<Navigate to="/auth/admin/login" replace />}
        />

        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;







// import { Routes, Route, Navigate } from "react-router-dom";
// import PublicRoutes from "./PublicRoutes";
// import UserRoutes from "./UserRoutes";
// import AdminRoutes from "./AdminRoutes";
// import MechanicRoutes from "./MechanicRoutes";


// const AppRoutes: React.FC = () => {
//   return (
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/*" element={<PublicRoutes />} />

//         {/* Authenticated Routes */}
//         <Route path="/user/*" element={<UserRoutes />} />
//         <Route path="/admin/*" element={<AdminRoutes />} />
//         <Route path="/mechanic/*" element={<MechanicRoutes />} />

//         {/* Redirects Admin only have signup */}
//         <Route path="/auth/admin/signup" element={<Navigate to="/auth/admin/login" replace />} />

//         <Route path="*" element={<div>Not Found</div>} />
//       </Routes>
//   );
// };

// export default AppRoutes;


