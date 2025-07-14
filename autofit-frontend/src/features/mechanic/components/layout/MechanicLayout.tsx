import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, MessageSquare,Briefcase,User,DollarSign,Menu,X,Settings,ChevronDown,Wrench,Power,Bell} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Notification from "../Notification";
import Logout from "./Logout";
import { initSocket } from "@/lib/socket";
import { useLogoutHandler } from "../../../../hooks/useLogoutHandler";
import toast from "react-hot-toast";
import { useGetInfoQuery, useSetAvailabilityMutation } from "../../../../services/mechanicServices/mechanicApi";
import { setAvailability } from "../../slices/mechanicSlice";
import LazyImage from "@/components/shared/LazyImage";


const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/mechanic/dashboard",
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    count: 3,
    href: "/mechanic/messages",
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: Briefcase,
    href: "/mechanic/jobs",
  },
  {
    id: "account",
    label: "My Account",
    icon: User,
    href: "/mechanic/account",
  },
  {
    id: "earnings",
    label: "My Earnings",
    icon: DollarSign,
    href: "/mechanic/earnings",
  },
];

export default function MechanicDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { handleLogout } = useLogoutHandler();
  const socket = initSocket();
  const dispatch = useDispatch();
  const mechanic = useSelector((state: RootState) => state.mechanicSlice);
  const [setAvailabilityStatus] = useSetAvailabilityMutation();
  const { data, isLoading: isFetchingInfo } = useGetInfoQuery();

  useEffect(() => {
    socket.on("forceLogout", (data) => {
      toast.error(data.message);
      handleLogout();
    });

    return () => {
      socket.off("forceLogout");
    };
  }, [handleLogout,socket]);

  const user = useSelector((state: RootState) => state.auth.user);
  const name = user?.name || "User";
  const email = user?.email || "user@example.com";
  const avatar = user?.avatar || null;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const activeItem = navItems.find((item) =>
      location.pathname.startsWith(item.href)
    );
    setActiveTab(activeItem?.id || "dashboard");
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "messages":
        return "Messages";
      case "jobs":
        return "Jobs";
      case "account":
        return "My Account";
      case "earnings":
        return "My Earnings";
      default:
        return "Dashboard";
    }
  };

  const getPageDescription = () => {
    switch (activeTab) {
      case "dashboard":
        return "Overview of your daily activities and performance";
      case "messages":
        return "Customer communications and notifications";
      case "jobs":
        return "Manage your service requests and work orders";
      case "account":
        return "Personal information and account settings";
      case "earnings":
        return "Revenue tracking and payment history";
      default:
        return "Overview of your daily activities and performance";
    }
  };

  useEffect(() => {
    dispatch(setAvailability(data?.data?.availability));
  }, [data,dispatch]);

  const changeAvailability = async () => {
    try {
      const result = await setAvailabilityStatus(
        mechanic.availability === "available" ? "notAvailable" : "available"
      ).unwrap();

      dispatch(setAvailability(result.data.availability));
    } catch (error) {
      console.error("Error updating availability", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl lg:translate-x-0 transition-transform duration-300 ease-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">MechPro</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User Info with Availability */}
        <div className="px-6 py-4 bg-gray-50/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full border border-gray-200 shadow-sm overflow-hidden">
              {avatar ? (
                <LazyImage publicId={avatar} resourceType={'image'} alt="avatar"/>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-semibold">{initials}</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{name}</p>
              <p className="text-sm text-gray-600 truncate">{email}</p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-gray-200/50">
            <div className="flex items-center space-x-2">
              <Power
                className={cn(
                  "w-4 h-4",
                  mechanic.availability === "available" || mechanic.availability === "notAvailable"
                    ? "text-green-600"
                    : "text-gray-400"
                )}
              />
              <span className="text-sm font-medium text-gray-900">
                Availability
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  mechanic.availability === "notAvailable"
                    ? "text-gray-500"
                    : "text-green-600"
                )}
              >
                {mechanic.availability === "notAvailable"
                  ? "Offline"
                  : mechanic.availability === "busy"
                  ? "Busy"
                  : "Online"}
              </span>

              <Switch
                checked={mechanic.availability !== "notAvailable"}
                onClick={changeAvailability}
                className={cn(
                  "transition-colors",
                  mechanic.availability === "available" && "data-[state=checked]:bg-green-600",
                  mechanic.availability === "busy" && "data-[state=checked]:bg-orange-500",
                  mechanic.availability === "notAvailable" && "data-[state=unchecked]:bg-gray-500"
                )}
                aria-label="Toggle availability"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.href);
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              )}
              aria-label={`Go to ${item.label}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count && (
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Menu */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50/80 backdrop-blur-md">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-100"
            onClick={() => navigate("/mechanic/settings")}
            aria-label="Go to settings"
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Fixed Header */}
        <header
          className={cn(
            "fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm transition-transform duration-300 ease-out",
            isNavbarVisible ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm text-gray-600">
                    Welcome back, {name.split(" ")[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    Have a productive day!
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-white/80 rounded-full border border-gray-200/50">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      mechanic.availability === "available" ? "bg-green-500" : "bg-gray-400"
                    )}
                  ></div>
                  <span className="text-xs font-medium text-gray-700">
                    {mechanic.availability === "available"
                      ? "Available"
                      : mechanic.availability === "busy"
                      ? "Busy"
                      : "Offline"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isFetchingInfo ? (
                <Bell className="h-5 w-5" />
              ) : (
                <Notification notifications={data.data.notifications} />
              )}

              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="Open profile menu"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                    {avatar ? (
                      <LazyImage publicId={avatar} resourceType={'image'} alt="avatar"/>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {initials}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-600 truncate max-w-[120px]">
                      {email}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-gray-500 transition-transform duration-200",
                      isDropdownOpen && "rotate-180"
                    )}
                  />
                </Button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-xl p-1 z-20 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2">
                      <p className="font-medium text-gray-900">{name}</p>
                      <p className="text-xs text-gray-600 truncate">{email}</p>
                    </div>
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                      className="w-full flex items-center hover:bg-gray-50 rounded-lg px-3 py-2 text-left transition-colors duration-150"
                      onClick={() => {
                        navigate("/mechanic/account");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </button>
                    <button
                      className="w-full flex items-center hover:bg-gray-50 rounded-lg px-3 py-2 text-left transition-colors duration-150"
                      onClick={() => {
                        navigate("/mechanic/settings");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </button>

                    <Logout />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Conditionally render the heading section only if not on the messages page */}
        {activeTab !== "messages" && (
          <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-6 mt-16">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-gray-600 mt-1">{getPageDescription()}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Today</p>
                  <p className="text-xs text-gray-600">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Adjust the top margin when the heading is not present */}
        <div
          className={cn(
            "px-3 md:px-10 pt-5 pb-8",
            activeTab === "messages" && "mt-16"
          )}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}