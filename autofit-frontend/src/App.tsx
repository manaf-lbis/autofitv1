import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./features/auth/slices/authSlice";
import { useGetCurrentUserQuery } from "./features/auth/api/authApi";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/User/auth/Login";
import Signup from "./pages/User/auth/Signup";
import ForgotPassword from "./features/auth/Pages/ForgotPasswordPage";
import Home from "./pages/User/Home"; 
import Service from "./pages/User/Service";
import PublicRoute from "./components/Routes/PublicRoute";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import "@fontsource/poppins";
import Loading from "./components/Animations/Loading";
import MainLayout from "./pages/User/Layout";
import ProfileLayout from "./features/user/profile/layout/ProfileLayout";
import ProfilePage from "@/pages/User/profile/Profile";
import ServiceHistory from "./pages/User/profile/ServiceHistory";


function App() {
    const dispatch = useDispatch();
    const { data, isLoading, isError } = useGetCurrentUserQuery();

    useEffect(() => {
        if (data && data.status === "success") {
            dispatch(setUser({ name: data.data.name, role: data.data.role }));
        } else if (isError) {
            dispatch(clearUser());
        }
    }, [data, isError, dispatch]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <AnimatePresence>
            <BrowserRouter>
                <Routes>
                    
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

                        <Route element={<MainLayout/>}>
                            <Route path="/" element={<Home />} />
                            <Route path="/service" element={<Service />} />


                            <Route element={<ProtectedRoute />}>
                              <Route path="/" element={<ProfileLayout/>}>

                                <Route path="profile" element={<ProfilePage />} />
                                <Route path="service-history" element={<ServiceHistory />} />
                                

                              </Route>
                            </Route>
                        </Route>
                      
                </Routes>
            </BrowserRouter>
        </AnimatePresence>
    );
}

export default App;