import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, ChevronDown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { clearUser } from "@/features/auth/slices/authSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface UserProfileDropdownProps {
  user?: {
    name: string;
    role: "mechanic" | "user" | "admin";
    email: string;
  };
}

export default function UserProfileDropdown({
  user,
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      onClick: () => {
        navigate("/user/profile");
        setIsOpen(false);
      },
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => {
        console.log("Navigate to settings");
        setIsOpen(false);
      },
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: async () => {
        await logout().unwrap();
        dispatch(clearUser());
        navigate("/user/login", { replace: true });
        toast.success("Logged out successfully");
        setIsOpen(false);
      },
      danger: true,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-white text-gray-800 border border-gray-200 shadow-sm flex items-center justify-center font-semibold text-sm">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full shadow-md"></div>
        </div>

        {/* User Info (Hidden on mobile) */}
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>

        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="hidden md:block"
        >
          <ChevronDown
            size={16}
            className="text-gray-500 group-hover:text-gray-700"
          />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-white text-gray-800 border border-gray-200 shadow-sm flex items-center justify-center font-semibold text-sm">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {user?.name
                      ? user.name.length > 10
                        ? user.name.slice(0, 10) + "..."
                        : user.name
                      : ""}
                  </div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => (
                <motion.button
                  key={item.label}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors duration-150 ${
                    item.danger
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-700"
                  }`}
                  onClick={item.onClick}
                  disabled={item.label === "Logout" && isLoading}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {item.label === "Logout" && isLoading ? (
                    <div className="w-full flex gap-1 items-center text-red-600 animate-pulse">
                      <Loader2 className="animate-spin" size={16} />
                      <span className="text-sm font-medium">
                        Logging out...
                      </span>
                    </div>
                  ) : (
                    <>
                      <item.icon
                        size={18}
                        className={
                          item.danger ? "text-red-500" : "text-gray-500"
                        }
                      />
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
