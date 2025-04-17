import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Wrench, Lock, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/features/auth/slices/authSlice';

const navItems = [
  { label: 'Home', icon: <Home className="w-6 h-6" />, path: '/' },
  { label: 'Profile', icon: <User className="w-6 h-6" />, path: '/profile' },
  { label: 'Service History', icon: <Wrench className="w-6 h-6" />, path: '/service-history' },
  { label: 'Password', icon: <Lock className="w-6 h-6" />, path: '/password' },
  { label: 'Logout', icon: <LogOut className="w-6 h-6" />, action: 'logout' },
];

const ResponsiveSidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleClick = (item: typeof navItems[number]) => {
    if (item.action === 'logout') {
      dispatch(clearUser());
      navigate('/login');
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const activeIndex = navItems.findIndex(item => item.path === location.pathname);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen bg-white shadow-lg">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative pt-4 space-y-1"
        >
          {/* Active indicator bar */}
          <motion.div
            layoutId="sidebar-indicator"
            className="absolute left-0 w-1 bg-blue-500 rounded-r-full"
            style={{
              top: activeIndex * 56 + 16,
              height: 40,
            }}
          />
          {navItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.button
                key={idx}
                onClick={() => handleClick(item)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors duration-200 relative z-10
                  ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                whileHover={{ x: isActive ? 0 : 4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {React.isValidElement(item.icon) &&
                  React.cloneElement(item.icon as React.ReactElement<any>, {
                    className: `w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`,
                  })
                }
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </motion.nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <AnimatePresence>
        <motion.nav
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner flex justify-around items-center py-2 md:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
        >
          {navItems.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <motion.button
                key={idx}
                onClick={() => handleClick(item)}
                aria-current={isActive ? 'page' : undefined}
                className="flex flex-col items-center"
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div
                  className={`p-2 rounded-full transition-colors duration-200
                    ${isActive ? 'bg-blue-100' : 'bg-transparent hover:bg-gray-100'}`}
                >
                  {React.isValidElement(item.icon) &&
                    React.cloneElement(item.icon as React.ReactElement<any>, {
                      className: `w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`,
                    })
                  }
                </div>
                <span
                  className={`mt-1 text-xs font-medium transition-colors duration-200
                    ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </motion.nav>
      </AnimatePresence>
    </>
  );
};

export default ResponsiveSidebar;
