import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/services/authServices/authApi";
import { LogOut } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const LogoutButton = () => {
    const [logout] = useLogoutMutation()
    const navigate = useNavigate()
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
         setIsLoggingOut(true);
         await logout().unwrap()
          navigate('/auth/mechanic/login',{replace:true})
          toast.success('Logouted Successfully')
        } catch {
          toast.error('Logout Failed ')
        } finally {
          setIsLoggingOut(false);
        }
      };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 min-w-[120px]"
    >
      {isLoggingOut ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="w-4 h-4" />
          Logout
        </>
      )}
    </Button>
  );
};

export default LogoutButton;
