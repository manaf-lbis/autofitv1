import { Clock, Shield, Star } from 'lucide-react';

export default function StatsCards() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-8 max-w-4xl mx-auto px-2 sm:px-4">
      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">15min</div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium text-center">Average Response</div>
          </div>
        </div>
      </div>

      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">24/7</div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium text-center">Always Available</div>
          </div>
        </div>
      </div>

      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 sm:w-10 h-8 sm:h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <Star className="w-4 sm:w-5 h-4 sm:h-5 fill-yellow-500 text-yellow-500" />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">4.9</div>
            <div className="text-xs sm:text-sm text-gray-700 font-medium text-center">Customer Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}