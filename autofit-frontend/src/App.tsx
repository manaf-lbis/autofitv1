import { BrowserRouter, Route, Routes } from "react-router-dom";
import '@fontsource/poppins';
import Login from "./pages/User/Login";
import Signup from "./pages/User/Signup";
import { AnimatePresence } from "framer-motion";
import ForgotPassword from "@/features/auth/Pages/ForgotPasswordPage";
import Home from "./pages/User/Home";

function App() {
  return (
    <AnimatePresence>
      <BrowserRouter>
        <Routes>
          <Route path ='/login' element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/" element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </AnimatePresence>
  );
}

export default App;
