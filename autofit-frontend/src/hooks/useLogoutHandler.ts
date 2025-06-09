import { useLogoutMutation } from "@/features/auth/api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useLogoutHandler = () => {
  const navigate = useNavigate();
  const [logout,{isLoading:isLoggingOut}] = useLogoutMutation();

  const handleLogout = async (logoutRoute :string = 'user') => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      navigate(`/auth/${logoutRoute}/login`);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to logout");
    }
  };

  return {handleLogout,isLoggingOut};
};
