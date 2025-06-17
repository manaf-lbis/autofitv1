import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface QuotationItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Quotation {
  _id: string;
  items: QuotationItem[];
  total: number;
}

interface QuotationModalProps {
  quotation: Quotation;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  isProcessing: boolean;
  isRejecting: boolean;
}

export function QuotationModal({
  quotation,
  onClose,
  onAccept,
  onReject,
  isProcessing,
  isRejecting,
}: QuotationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto"
      >
        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
          <h3 className="font-medium text-gray-900">Service Quotation</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Quotation Details</h4>
                <p className="text-xs text-gray-600">Review the quotation before proceeding.</p>
              </div>
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Sl No
                    </th>
                    <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-2 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-2 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-2 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quotation.items.map((item, index) => (
                    <tr key={item._id}>
                      <td className="px-2 py-2 text-xs text-gray-900">{index + 1}</td>
                      <td className="px-2 py-2 text-xs text-gray-900">{item.name}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-center">{item.quantity}</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-right">{item.price.toFixed(2)} INR</td>
                      <td className="px-2 py-2 text-xs text-gray-900 text-right">
                        {(item.quantity * item.price).toFixed(2)} INR
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="px-2 py-2 text-xs font-medium text-gray-900 text-right">
                      Total
                    </td>
                    <td className="px-2 py-2 text-xs font-medium text-gray-900 text-right">
                      {quotation.total.toFixed(2)} INR
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onAccept}
              className="flex-1 text-sm h-9"
              disabled={isProcessing || isRejecting}
            >
              {isProcessing ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                "Accept & Pay"
              )}
            </Button>
            <Button
              onClick={onReject}
              variant="outline"
              className="flex-1 text-sm h-9 text-red-600 border-red-200 hover:bg-red-50"
              disabled={isRejecting || isProcessing}
            >
              {isRejecting ? (
                <>
                  <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Rejecting...
                </>
              ) : (
                "Reject Quotation"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}