import { MessageCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface HeadingSectionProps {
  title: string;
  description: string;
  status: string;
  bookingId: string;
  onMessageClick: () => void;
  onCancelClick: () => void;
  isCancelled: boolean;
  isCompleted: boolean;
}

export function HeadingSection({
  title,
  description,
  status,
  bookingId,
  onMessageClick,
  onCancelClick,
  isCancelled,
  isCompleted,
}: HeadingSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg p-6 mb-5 border border-gray-100"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-gray-600">{description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-2 py-1">
              {status}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
              ID: {bookingId}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            onClick={onCancelClick}
            disabled={isCancelled || isCompleted}
          >
            <XCircle className="w-4 h-4" />
            {isCancelled ? "Cancelled" : "Cancel"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}