import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface LeftColumnProps {
  mechanic: { name: string; avatar: string };
  vehicle: { brand: string; modelName: string; regNo: string; owner: string };
  issue: string;
  description: string;
}

export function LeftColumn({ mechanic, vehicle, issue, description }: LeftColumnProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="lg:col-span-1 order-2 lg:order-1"
    >
      {/* Mechanic Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4">
        <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
          <h3 className="text-sm font-medium text-gray-700">Assigned Mechanic</h3>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-blue-100">
              <img
                src={mechanic.avatar || "/placeholder.svg"}
                alt={mechanic.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{mechanic.name}</h4>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Info Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden mb-4">
        <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
          <h3 className="text-sm font-medium text-gray-700">Vehicle Information</h3>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Make & Model</span>
              <span className="text-xs font-medium text-gray-900">
                {vehicle.brand} {vehicle.modelName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Registration</span>
              <span className="text-xs font-medium text-gray-900">{vehicle.regNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Owner</span>
              <span className="text-xs font-medium text-gray-900">{vehicle.owner}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Details Card */}
      <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
          <h3 className="text-sm font-medium text-gray-700">Issue Details</h3>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-600">Description</span>
              <p className="text-xs font-medium text-gray-900 mt-0.5">{description}</p>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Category</span>
              <span className="text-xs font-medium text-gray-900">{issue}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}