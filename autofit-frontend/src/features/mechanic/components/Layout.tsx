import React, { useState } from 'react';
import { LayoutDashboard, MessageSquareText, Wrench, User, DollarSign, Bell, LogOut, Menu, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLogoutMutation } from '@/features/auth/api/authApi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function MechanicDashboardLayout() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const mechanicData = useSelector((state: RootState) => state.auth.user);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/mechanic/dashboard' },
    { id: 'messages', label: 'Messages', icon: MessageSquareText, href: '/mechanic/messages' },
    { id: 'jobs', label: 'Jobs', icon: Wrench, href: '/mechanic/jobs' },
    { id: 'account', label: 'My Account', icon: User, href: '/mechanic/account' },
    { id: 'earnings', label: 'My Earnings', icon: DollarSign, href: '/mechanic/earnings' },
  ];

  const activeTab = sidebarItems.find(item => {
    if (item.href === '/mechanic/dashboard') {
      return location.pathname === '/mechanic/dashboard' || location.pathname === '/mechanic/dashboard/';
    }
    return location.pathname.startsWith(item.href);
  })?.id || 'dashboard';

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success('Logged out successfully');
      navigate('/auth/login');
    } catch (err) {
      const e = err as { data?: { message?: string } };
      toast.error(e.data?.message || 'Failed to logout');
    } finally {
      setShowProfileMenu(false);
    }
  };

  const handleSidebarItemClick = (href: string) => {
    navigate(href);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white/60 backdrop-blur-xl border-b border-white/20 h-16 flex-shrink-0 relative z-[200]">
        <div className="px-4 lg:px-6 h-full flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-white/50 rounded-xl"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 bg-blue-500/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-slate-800">AutoFit</h1>
                <p className="text-xs text-slate-500 -mt-1">Mechanic Portal</p>
              </div>
            </div>
          </div>
          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative p-2 hover:bg-white/50 rounded-xl">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-white"></span>
            </Button>
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 transition-all duration-200"
              >
                <Avatar className="h-8 w-8 ring-2 ring-white/50">
                  <AvatarImage src={mechanicData?.avatar || "/placeholder.svg"} alt="avatar" />
                  <AvatarFallback className="bg-blue-500/90 text-white text-sm font-medium">
                    {mechanicData?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                {mechanicData && (
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-800">{mechanicData.name}</p>
                    {/* Remove shopName if not in UserData */}
                    {/* <p className="text-xs text-slate-500">{mechanicData.shopName}</p> */}
                  </div>
                )}
              </button>
              {showProfileMenu && mechanicData && (
                <>
                  <div className="fixed inset-0 z-[250]" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 top-12 z-[300] w-56 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/30">
                      <p className="text-sm font-medium text-slate-800">{mechanicData.name}</p>
                      <p className="text-xs text-slate-500">{mechanicData.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/mechanic/settings"
                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/50 flex items-center gap-3 text-slate-700 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50/80 flex items-center gap-3 text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
            w-72 bg-white/50 backdrop-blur-xl border-r border-white/30 
            h-full shadow-xl flex flex-col
            transform transition-all duration-300 ease-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-6 border-b border-white/30 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-white/50">
                <AvatarImage src={mechanicData?.avatar || "/placeholder.svg"} alt={mechanicData?.name || 'avatar'} />
                <AvatarFallback className="bg-blue-500/90 text-white font-medium">
                  {mechanicData?.name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              {mechanicData && (
                <div>
                  <h3 className="font-medium text-slate-800">{mechanicData.name}</h3>
                  {/* Remove shopName if not in UserData */}
                  {/* <p className="text-sm text-slate-500">{mechanicData.shopName}</p> */}
                </div>
              )}
            </div>
          </div>
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => handleSidebarItemClick(item.href)}
                  className={`
                    w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 text-left group
                    ${
                      isActive
                        ? "bg-blue-500/10 text-blue-700 border border-blue-200/50 shadow-lg shadow-blue-500/10"
                        : "text-slate-700 hover:bg-white/60 hover:shadow-md"
                    }
                  `}
                >
                  <div
                    className={`
                      p-2 rounded-lg transition-all duration-200
                      ${isActive ? "bg-blue-500/20 text-blue-600" : "bg-white/60 text-slate-600 group-hover:bg-white group-hover:shadow-sm"}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/30 bg-gradient-to-t from-white/40 to-transparent flex-shrink-0">
            <div className="bg-blue-50/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200/30">
              <h4 className="font-medium text-slate-800 text-sm mb-1">Need Help?</h4>
              <p className="text-xs text-slate-600 mb-3">Contact our support team</p>
              <Button
                size="sm"
                className="w-full bg-blue-500/90 hover:bg-blue-600/90 text-white border-0 rounded-lg shadow-lg shadow-blue-500/20"
              >
                Get Support
              </Button>
            </div>
          </div>
        </aside>
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 lg:p-6 flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center space-x-4 mb-2">
                  {sidebarItems.find((item) => item.id === activeTab)?.icon && (
                    <div className="p-3 rounded-xl bg-blue-500/10 backdrop-blur-sm border border-blue-200/30 shadow-lg shadow-blue-500/10">
                      {(() => {
                        const Icon = sidebarItems.find((item) => item.id === activeTab)?.icon;
                        return Icon ? <Icon className="h-4 w-4 text-blue-600" /> : null;
                      })()}
                    </div>
                  )}
                  <div>
                    <h1 className="text-lg lg:text-xl font-semibold text-slate-800 capitalize">{activeTab}</h1>
                    <p className="text-slate-600 text-sm lg:text-sm">
                      {activeTab === 'dashboard' && 'Overview of your business performance'}
                      {activeTab === 'messages' && 'Communicate with your customers'}
                      {activeTab === 'jobs' && 'Manage your service requests'}
                      {activeTab === 'account' && 'Update your profile and settings'}
                      {activeTab === 'earnings' && 'Track your income and payments'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl flex-1 overflow-y-auto">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}