import { XCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useGenerateInvoiceMutation } from "@/services/userServices/servicesApi";
import toast from "react-hot-toast";

interface HeadingSectionProps {
  title: string;
  description: string;
  status: string;
  statusString: string;
  bookingId: string;
  onMessageClick?: () => void;
  onCancelClick?: () => void;
  isCancelled: boolean;
  isCompleted: boolean;
}

export function HeadingSection({
  title,
  description,
  status,
  bookingId,
  onCancelClick,
  isCompleted,
  statusString
}: HeadingSectionProps) {
  const [getInvoice, { isLoading }] = useGenerateInvoiceMutation();
  

  const handleDownloadInvoice = async () => {
    try {
      if (!bookingId) throw new Error("Invalid service ID");
      await getInvoice({ serviceId: bookingId }).unwrap();
      toast.success("Invoice download started!");
    } catch (error: any) {
      toast.error(error.message || "Failed to download invoice");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg p-6 mb-5 border border-gray-100"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm sm:text-base text-gray-600">{description}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-2 py-1 text-xs sm:text-sm">
              {status}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">
              ID: {bookingId}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          { onCancelClick && !["in_progress", "completed" , "canceled"].includes(statusString) && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={onCancelClick}
              aria-label="Cancel service"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </Button>
          )}
          {isCompleted && (
            <Button
              size="sm"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleDownloadInvoice}
              disabled={isLoading}
              aria-label="Download invoice"
            >
              {isLoading ? (
                <span className="loading loading-spinner text-white"></span>
              ) : (
                <Download className="w-4 h-4" />
              )}
              Invoice
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}