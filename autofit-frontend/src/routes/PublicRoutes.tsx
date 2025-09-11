import { Routes, Route } from "react-router-dom";
import PublicRoute from "../components/Routes/PublicRoute";
import RedirectToAuth from "../components/Auth/RedirectToAuth";
import MainLayout from "../features/user/components/layout/UserLayout";
import RoleLoginPage from "../features/auth/Pages/RoleLoginPage";
import RoleSignupPage from "../features/auth/Pages/RoleSignupPage";
import RoleForgotPassword from "../features/auth/Pages/RoleForgotPassword";
import HomePage from "@/features/user/pages/Home";
import Services from "@/features/user/pages/Services";
import RoadsideAssistance from "@/features/user/pages/roadsideAssistance/RoadsideAssistance";
import PreTripCheckupPlans from "@/features/user/pages/PreTripCheckup/PreTripCheckupPlans";
import VisionPage from "@/features/user/pages/OurVision";
import HowItWorksPage from "@/features/user/pages/HowItWorks";




const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services/>} />
        <Route path="/vision" element={<VisionPage/>} />
        <Route path="/how-it-works" element={<HowItWorksPage/>} />

        <Route path="roadside-assistance" element={<RoadsideAssistance />} />
        <Route path="pretrip-checkup/plans" element={<PreTripCheckupPlans />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/auth/:role/login" element={<RoleLoginPage />} />
        <Route path="/auth/:role/signup" element={<RoleSignupPage />} />
        <Route path="/auth/:role/forgot-password" element={<RoleForgotPassword />} />
        <Route path="/:role/login" element={<RedirectToAuth type="login" />} />
        <Route path="/:role/signup" element={<RedirectToAuth type="signup" />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;



