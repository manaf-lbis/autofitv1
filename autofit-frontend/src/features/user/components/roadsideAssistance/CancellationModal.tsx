import { X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CancellationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export function CancellationModal({ onClose, onConfirm, isProcessing }: CancellationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full"
      >
        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-red-50 to-red-100/50">
          <h3 className="font-medium text-gray-900">Cancel Service</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">Are you sure?</h4>
              <p className="text-sm text-gray-600">
                Cancelling this service request cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onConfirm}
              variant="destructive"
              className="flex-1 text-sm h-9 bg-red-600 hover:bg-red-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                "Yes, Cancel Service"
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-sm h-9"
              onClick={onClose}
              disabled={isProcessing}
            >
              No, Keep Booking
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}