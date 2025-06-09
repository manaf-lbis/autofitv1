import { LogOut } from "lucide-react";
import { useLogoutHandler } from "../../../../hooks/useLogoutHandler";

const Logout = () => {
  const { handleLogout, isLoggingOut } = useLogoutHandler();

  return (
    <>
      <button
        className="w-full flex items-center text-red-600 hover:bg-red-50 rounded-lg px-3 py-2 text-left transition-colors duration-150"
        onClick={() => handleLogout("mechanic")}
        disabled={isLoggingOut}
        aria-label="Logout"
      >
        <LogOut className="mr-3 h-4 w-4" />
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </>
  );
};

export default Logout;
