import { useState, useEffect } from "react"
import { X, Home, Settings, HelpCircle, DollarSign, MessageCircle, Loader2, Search } from "lucide-react"
import UserProfileDropdown from "./Dropdown"
import type { RootState } from "@/store/store"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import AnimatedLogo from "./AnimatedLogo"
import { useLogoutMutation } from "@/services/authServices/authApi"
import { clearUser } from "@/features/auth/slices/authSlice"
import toast from "react-hot-toast"
import SearchBar from "./SearchBar"

export default function NavbarWithProfile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const [logout, { isLoading }] = useLogoutMutation()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Services", href: "/services", icon: Settings },
    { name: "How it Works", href: "/how-it-works", icon: HelpCircle },
    { name: "Pricing", href: "/pretrip-checkup/plans", icon: DollarSign },
    { name: "Our Vision", href: "/vision", icon: MessageCircle },
  ]

  const handleMobileSearchToggle = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen)
    if (isMenuOpen) {
      setIsMenuOpen(false)
      document.body.style.overflow = 'unset'
    }
  }

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
    if (isMobileSearchOpen) setIsMobileSearchOpen(false)
  }

  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.style.overflow = 'unset'
  }

  return (
    <>
      <header
        className={`fixed top-0 w-full z-40 transition-transform duration-300 ease-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Modern Clean Navbar */}
        <div className="bg-white/85 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center hover:opacity-90 transition-opacity duration-200">
                <AnimatedLogo />
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link to={item.href} key={item.name}>
                    <div className="relative px-4 py-2.5 text-slate-600 hover:text-slate-900 transition-all duration-200 rounded-xl hover:bg-slate-50/80 font-medium text-[15px] active:scale-95">
                      {item.name}
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center space-x-3 relative z-50">
                <SearchBar isNavbar={true} />

                {!isAuthenticated || !user ? (
                  <Link to="/user/login">
                    <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 text-[15px]">
                      Get Started
                    </button>
                  </Link>
                ) : (
                  <UserProfileDropdown user={user} />
                )}
              </div>

              {/* Mobile Controls */}
              <div className="lg:hidden flex items-center space-x-2">
                {/* Mobile Search Button */}
                <button
                  className={`p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                    isMobileSearchOpen 
                      ? 'bg-slate-100 text-slate-800' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  onClick={handleMobileSearchToggle}
                  aria-label="Search"
                >
                  <Search size={19} />
                </button>

                {/* Profile/Menu Button */}
                {isAuthenticated && user ? (
                  <button
                    className="transition-all duration-200 active:scale-95"
                    onClick={handleMenuToggle}
                    aria-label="User Menu"
                  >
                    <div className={`w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm transition-all duration-200 ${
                      isMenuOpen ? 'bg-blue-700 rotate-90' : 'hover:bg-blue-700'
                    }`}>
                      {isMenuOpen ? (
                        <X size={16} />
                      ) : (
                        user.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                  </button>
                ) : (
                  <button
                    className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 active:scale-95"
                    onClick={handleMenuToggle}
                    aria-label="Menu"
                  >
                    <div className="w-5 h-5 flex flex-col justify-center items-center">
                      <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`}></span>
                      <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                      <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`}></span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className={`lg:hidden transition-all duration-300 ease-out ${
          isMobileSearchOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-white/85 backdrop-blur-xl border-b border-slate-200/60">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <SearchBar onClose={closeMobileSearch} />
                </div>
                <button
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 active:scale-95"
                  onClick={closeMobileSearch}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
        isMenuOpen ? 'visible' : 'invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/15 backdrop-blur-sm transition-all duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`} 
          onClick={closeMenu}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-16 right-4 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/80 transition-all duration-300 ${
          isMenuOpen ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-4 opacity-0 scale-95'
        }`}>
          <div className="p-5 space-y-5 max-h-[calc(100vh-6rem)] overflow-y-auto">
            {/* User Profile Section */}
            {isAuthenticated && user ? (
              <div className="p-4 bg-slate-50/80 rounded-xl">
                <button 
                  onClick={() => navigate('/user/profile')} 
                  className="w-full flex items-center space-x-3 cursor-pointer focus:outline-none"
                  aria-label="Go to profile"
                  tabIndex={0}
                >
                  <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate text-[15px]">{user.name}</div>
                    <div className="text-sm text-slate-500 truncate">{user.email}</div>
                  </div>
                  <div className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all duration-200 active:scale-95 inline-block">
                    <Settings size={17} />
                  </div>
                </button>
              </div>
            ) : (
              <Link to="/user/login" onClick={closeMenu}>
                <button className="w-full px-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 active:scale-95 text-[15px]">
                  Get Started
                </button>
              </Link>
            )}

            {/* Quick Search Access */}
            <button
              onClick={() => {
                closeMenu()
                setIsMobileSearchOpen(true)
              }}
              className="w-full flex items-center space-x-3 px-4 py-3.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50/80 rounded-xl transition-all duration-200 font-medium border border-slate-200/80 border-dashed active:scale-95 text-[15px]"
            >
              <Search className="h-4 w-4 text-slate-600" />
              <span>Search Services</span>
            </button>

            {/* Navigation Links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-3 px-4 py-3.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50/80 rounded-xl transition-all duration-200 font-medium active:scale-95 text-[15px]"
                  onClick={closeMenu}
                >
                  <item.icon className="h-4 w-4 text-slate-500" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Logout Section */}
            {isAuthenticated && user && (
              <div className="pt-3 border-t border-slate-200/80">
                {isLoading ? (
                  <div className="flex items-center space-x-3 px-4 py-3.5 text-slate-600 text-[15px]">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="font-medium">Signing out...</span>
                  </div>
                ) : (
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-xl transition-all duration-200 font-medium active:scale-95 text-[15px]"
                    onClick={async () => {
                      await logout().unwrap()
                      dispatch(clearUser())
                      window.location.href = "/auth/user/login"
                      toast.success("Logged out successfully")
                      closeMenu()
                    }}
                  >
                    <X size={16} />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}