import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";
import { setUser, clearUser } from "@/features/auth/slices/authSlice";
import { AnimatePresence } from "framer-motion";
import Loading from "./components/Animations/Loading";
import PublicRoute from "./components/Routes/PublicRoute";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import MainLayout from "./pages/User/Layout";
import AdminLayout from "./pages/Admin/AdminLayout";
import RoleLoginPage from "./features/auth/Pages/RoleLoginPage";
import RoleSignupPage from "./features/auth/Pages/RoleSignupPage";
import RoleForgotPassword from "./features/auth/Pages/RoleForgotPassword";
import Home from "./pages/User/Home";
import Service from "./pages/User/Service";
import ProfileLayout from "./features/user/profile/layout/ProfileLayout";
import ProfilePage from "@/pages/User/profile/Profile";
import ServiceHistory from "./pages/User/profile/ServiceHistory";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { RootState } from "./store/store";



const RedirectToAuth: React.FC<{ type: 'login' | 'signup' }> = ({ type }) => {
  const { role } = useParams<{ role: string }>();
  const validRole = ['user', 'admin', 'mechanic'].includes(role || '') ? role : 'user';
  return <Navigate to={`/auth/${validRole}/${type}`} replace />;
};

const NavigationGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (
      isAuthenticated &&
      user?.role &&
      location.pathname.includes('/auth/') &&
      (location.pathname.includes('login') || location.pathname.includes('signup'))
    ) {
      const defaultRoute =
        user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'user' ? '/' : '/mechanic/dashboard';
      window.history.pushState(null, '', defaultRoute);
    }
  }, [isAuthenticated, user, location]);

  return <>{children}</>;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Restore auth state from localStorage on initial load
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedRole && storedAuth === 'true' && !isAuthenticated) {
      dispatch(setUser({ name: '', role: storedRole as 'user' | 'admin' | 'mechanic' }));
    }
  }, [dispatch, isAuthenticated]);

  // Fetch current user data, skip only if no auth state exists
  const { data, isLoading, isError } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated && !localStorage.getItem('isAuthenticated'),
  });

  useEffect(() => {
    if (data && data.status === "success") {
      dispatch(setUser({ name: data.data.name, role: data.data.role }));
      localStorage.setItem('userRole', data.data.role);
      localStorage.setItem('isAuthenticated', 'true');
    } else if (isError) {
      dispatch(clearUser());
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAuthenticated');
    }
  }, [data, isError, dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AnimatePresence>
      <BrowserRouter>
        <NavigationGuard>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/service" element={<Service />} />
            </Route>

            <Route element={<PublicRoute />}>
              <Route path="/auth/:role/login" element={<RoleLoginPage />} />
              <Route path="/auth/:role/signup" element={<RoleSignupPage />} />
              <Route path="/auth/:role/forgot-password" element={<RoleForgotPassword />} />
              <Route path="/:role/login" element={<RedirectToAuth type="login" />} />
              <Route path="/:role/signup" element={<RedirectToAuth type="signup" />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
              <Route element={<MainLayout />}>
                <Route path="/user" element={<ProfileLayout />}>
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="service-history" element={<ServiceHistory />} />
                </Route>
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["mechanic"]} />}>
              <Route path="/mechanic/dashboard" element={<div>Mechanic Dashboard</div>} />
            </Route>

            <Route path="/auth/admin/signup" element={<Navigate to="/auth/admin/login" replace />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </NavigationGuard>
      </BrowserRouter>
    </AnimatePresence>
  );
}

export default App;