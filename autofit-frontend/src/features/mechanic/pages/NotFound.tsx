import { Button } from "@/components/ui/button"
import { Home, Wrench, Cog, Car, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"


export default function NotFound() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/mechanic/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Gears */}
        <div className="absolute top-20 left-20 animate-spin-slow opacity-8">
          <Cog className="h-24 w-24 text-blue-300" />
        </div>
        <div className="absolute top-60 right-32 animate-spin-reverse opacity-8">
          <Settings className="h-20 w-20 text-gray-300" />
        </div>
        <div className="absolute bottom-40 left-40 animate-spin-slow opacity-8">
          <Cog className="h-16 w-16 text-blue-200" />
        </div>

        {/* Floating Cars */}
        <div className="absolute top-40 right-20 animate-float opacity-15">
          <Car className="h-14 w-14 text-blue-400" />
        </div>
        <div className="absolute bottom-60 left-60 animate-float-delayed opacity-15">
          <Car className="h-12 w-12 text-gray-400" />
        </div>

        {/* Floating Wrenches */}
        <div className="absolute top-80 left-80 animate-wiggle opacity-12">
          <Wrench className="h-10 w-10 text-orange-400" />
        </div>
        <div className="absolute bottom-80 right-80 animate-wiggle-delayed opacity-12">
          <Wrench className="h-8 w-8 text-red-400" />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-32 right-40 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-gradient-to-r from-orange-200 to-red-200 rounded-full blur-xl opacity-30 animate-pulse-slow animation-delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Glassmorphic Container */}
        <div className="bg-white/25 backdrop-blur-2xl border border-white/40 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          {/* Inner Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-50/20 rounded-3xl"></div>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Animated Icon Section */}
            <div className="mb-10">
              <div className="relative inline-block">
                {/* Main Wrench Icon */}
                <div className="w-28 h-28 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto animate-float shadow-xl border border-white/50">
                  <Wrench className="h-14 w-14 text-orange-500 animate-wiggle" />
                </div>

                {/* Orbiting Elements */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center animate-orbit shadow-lg">
                  <Cog className="h-4 w-4 text-blue-500 animate-spin" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center animate-orbit-reverse shadow-lg">
                  <Settings className="h-3 w-3 text-gray-500 animate-spin-reverse" />
                </div>

                {/* Ripple Effects */}
                <div className="absolute inset-0 w-28 h-28 mx-auto rounded-full border-2 border-orange-300/40 animate-ping"></div>
                <div className="absolute inset-0 w-28 h-28 mx-auto rounded-full border-2 border-blue-300/30 animate-ping animation-delay-500"></div>
              </div>
            </div>

            {/* 404 Text with Gradient */}
            <div className="mb-8">
              <h1 className="text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-blue-600 to-gray-700 animate-gradient-shift mb-4">
                404
              </h1>
              <div className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 animate-fade-in-up">
                  Service Not Available
                </h2>
                <p className="text-gray-600 text-lg animate-fade-in-up animation-delay-200">
                  The page you're looking for is currently under maintenance
                </p>
              </div>
            </div>

            {/* Back to Home Button */}
            <div className="animate-fade-in-up animation-delay-400">
              <Button
                onClick={handleGoHome}
                className="group relative bg-white/30 backdrop-blur-sm hover:bg-white/40 text-gray-800 border-2 border-white/50 hover:border-white/70 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Home className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" />
                <span className="relative">Back to Home</span>
              </Button>
            </div>
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-bounce animation-delay-700 opacity-60"></div>
          <div className="absolute top-1/3 right-6 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-50"></div>
          <div className="absolute bottom-1/3 left-6 w-1 h-1 bg-yellow-400 rounded-full animate-ping animation-delay-1000 opacity-50"></div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        
        @keyframes wiggle-delayed {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(6deg); }
          75% { transform: rotate(-6deg); }
        }
        
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(50px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
        }
        
        @keyframes orbit-reverse {
          from { transform: rotate(360deg) translateX(40px) rotate(360deg); }
          to { transform: rotate(0deg) translateX(40px) rotate(0deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 10s linear infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 3s ease-in-out infinite;
        }
        
        .animate-wiggle-delayed {
          animation: wiggle-delayed 4s ease-in-out infinite;
        }
        
        .animate-orbit {
          animation: orbit 8s linear infinite;
        }
        
        .animate-orbit-reverse {
          animation: orbit-reverse 6s linear infinite;
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .opacity-8 { opacity: 0.08; }
        .opacity-12 { opacity: 0.12; }
        .opacity-15 { opacity: 0.15; }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  )
}
