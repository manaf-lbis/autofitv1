import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./features/auth/slices/authSlice";
import { useGetCurrentUserQuery } from "./features/auth/api/authApi";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import ForgotPassword from "./features/auth/Pages/ForgotPasswordPage";
import Home from "./pages/User/Home"; // Assume this exists
// import Dashboard from "./pages/Dashboard"; // Assume this exists
import PublicRoute from "./components/Routes/PublicRoute";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import "@fontsource/poppins";

function App() {
    const dispatch = useDispatch();
    const { data, isLoading, isError } = useGetCurrentUserQuery();
    console.log('current user',data);
    

    useEffect(() => {
        if (data && data.status === "success") {
            dispatch(setUser({ name: data.data.name, role: data.data.role }));
        } else if (isError) {
            dispatch(clearUser());
        }
    }, [data, isError, dispatch]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AnimatePresence>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                    <Route path="/" element={<Home />} />
                    <Route element={<ProtectedRoute />}>
                        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </AnimatePresence>
    );
}

export default App;