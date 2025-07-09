import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Settings, HelpCircle, DollarSign, MessageCircle ,Loader2} from "lucide-react";
import UserProfileDropdown from "./Dropdown";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";
import { useLogoutMutation } from "@/services/authServices/authApi";
import { clearUser } from "@/features/auth/slices/authSlice";
import toast from "react-hot-toast";

export default function NavbarWithProfile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [logout,{isLoading}] = useLogoutMutation();

 const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services", icon: Settings },
    { name: "How it Works", href: "#how-it-works", icon: HelpCircle },
    { name: "Pricing", href: "#pricing", icon: DollarSign },
    { name: "Support", href: "#support", icon: MessageCircle },
  ];

  return (
    <motion.header
      className="fixed top-0 w-full z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Subtle backdrop with smooth blur */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-teal-50/20"
          animate={{ opacity: isScrolled  ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Clean Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <AnimatedLogo />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link to={item.href} key={item.name}>
              <motion.div
                className="relative px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-lg group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="relative z-10 font-medium">{item.name}</span>
                <motion.div
                  className="absolute inset-0 bg-gray-50 rounded-lg opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </motion.div>
              </Link>
            ))}
          </nav>

          {/* User Profile Dropdown (Desktop) */}
          {!isAuthenticated || !user ? (
            <Link to="/user/login">
              <motion.button
                className="px-6 py-2.5 hidden lg:flex bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                Get Started
              </motion.button>
            </Link>
          ) : (
            <div className="hidden lg:flex items-center">
              <UserProfileDropdown user={user} />
            </div>
          )}

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="px-4 py-6 space-y-2">
              {/* Mobile User Profile (Only if authenticated) */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              ) : (
                <Link to="/user/login" onClick={() => setIsMenuOpen(false)}>
                  <motion.button
                    className="w-full text-left px-4 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                  >
                    Get Started
                  </motion.button>
                </Link>
              )}

              {/* Mobile Navigation Links */}
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}

              {/* Mobile Profile Actions (Only if authenticated) */}
              {isAuthenticated && user && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link to="/user/profile" onClick={() => setIsMenuOpen(false)}>
                    <motion.button
                      className="w-full text-left px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.3, ease: "easeOut" }}
                    >
                      Profile
                    </motion.button>
                  </Link>

                 {
                  isLoading ? (
                    <div className="w-full flex gap-1 items-center text-red-600 animate-pulse">
                      <Loader2 className="animate-spin" size={16} /> Logging out...
                    </div>

                  ):
                  (<motion.button
                    className="w-full text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.3, ease: "easeOut" }}
                    onClick={async () => {
                      await logout().unwrap();
                      dispatch(clearUser());
                      window.location.href = "/auth/user/login"
                      toast.success("Logged out successfully");
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </motion.button>
                )
              }
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

