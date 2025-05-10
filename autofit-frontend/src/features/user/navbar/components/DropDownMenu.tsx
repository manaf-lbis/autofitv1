import React, { useRef, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/features/auth/api/authApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearUser } from "@/features/auth/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

export function Dropdown({ children }: { children: React.ReactElement }) {
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  const closePopover = () => {
    setOpen(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      navigate('/user/login', { replace: true });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (!user) return null;

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
            Hi, {user.name.toUpperCase()}
          </div>
          <div className="border-t" />
          <div className="py-1">
            <Link to="/user/profile">
              <button
                onClick={closePopover}
                className="w-full text-left text-sm px-3 py-2 hover:bg-muted hover:text-foreground transition-colors"
              >
                Profile
              </button>
            </Link>
            <button
              onClick={closePopover}
              className="w-full text-left text-sm px-3 py-2 hover:bg-muted hover:text-foreground transition-colors"
            >
              Settings
            </button>
          </div>
          <div className="border-t" />
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="flex gap-2 items-center w-full text-left text-sm px-3 py-2 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-sm"
            >
              <LogOut className="text-xs" /> Log out
            </button>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}

export default Dropdown;