import { motion } from "framer-motion";

interface MapTabContentProps {
  serviceLocation: { coordinates: [number, number] };
  mechanic: { name: string; avatar: string };
}

export function MapTabContent({ serviceLocation, mechanic }: MapTabContentProps) {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
        <h3 className="text-sm font-medium text-gray-700">Track Mechanic</h3>
      </div>
      <div className="p-4">
        <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-100 rounded-lg overflow-hidden relative">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFwQbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${serviceLocation.coordinates[1]},${serviceLocation.coordinates[0]}&zoom=15`}
          ></iframe>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-3 left-3 bg-white rounded-lg shadow-md p-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={mechanic.avatar || "/placeholder.svg"}
                  alt={mechanic.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900">{mechanic.name}</p>
                <p className="text-[10px] text-gray-600">On the way</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}