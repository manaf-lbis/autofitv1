import { AnimatePresence } from "framer-motion";
import { BrowserRouter } from "react-router-dom";
import AuthHandler from "@/components/Auth/AuthHandler";
import NavigationGuard from "@/components/Auth/NavigationGuard";
import AppRoutes from "@/routes/AppRoutes";

const App: React.FC = () => {

  return (
    <AnimatePresence>
      <BrowserRouter>
        <AuthHandler>
          <NavigationGuard>
            <AppRoutes />
          </NavigationGuard>
        </AuthHandler>
      </BrowserRouter>
    </AnimatePresence>
  );
};

export default App;