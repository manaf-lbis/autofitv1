import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { toast } from "react-toastify";
import { ApiError } from "@/types/apiError";
import { useDispatch, UseDispatch } from "react-redux";
import { RootState,AppDispatch } from "@/store/store";
import { clearUser } from "@/features/auth/slices/authSlice";
import { Link } from "react-router-dom";



export function Dropdown({ children }: { children: React.ReactElement }) {

  const [logout,{isLoading}] = useLogoutMutation()
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  const handleLogout = async ()=>{
    try {
     const response = await logout()
     dispatch(clearUser());
     toast.success("Logged out successfully")

    } catch (error ) {
      const err = error as ApiError
      toast.error(err.status)
    }
    
  }


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>

        <PopoverContent
          align="end"
          className={cn(
            "w-56 p-0 rounded-md border bg-popover shadow-md text-popover-foreground",
            "z-50"
          )}
          autoFocus={false}
          onOpenAutoFocus={(e) => e.preventDefault()} 
        >
          <div className="px-3 py-2 text-sm font-semibold text-Dark">
            My Account
          </div>

          <div className="border-t" />

          <div className="py-1">
            <Link to={'/profile'}>
              <button className="w-full text-left text-sm px-3 py-2 hover:bg-muted hover:text-foreground transition-colors ">
                Profile
              </button>
            </Link>

            <button className="w-full text-left text-sm px-3 py-2 hover:bg-muted hover:text-foreground transition-colors">
              Settings
            </button>
          </div>

          <div className="border-t" />

          <div className="py-1">
            <button onClick={handleLogout} className="flex gap-2 items-center w-full text-left text-sm px-3 py-2 text-red-500 hover:bg-red-500  hover:text-white transition-colors rounded-sm">
              <LogOut className="text-xs" /> Log out
            </button>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}

export default Dropdown;
