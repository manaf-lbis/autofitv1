import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";

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

interface PaymentTabContentProps {
  isPaymentComplete: boolean;
  quotationId?: Quotation;
  onViewQuotation: () => void;
}

export function PaymentTabContent({
  isPaymentComplete,
  quotationId,
  onViewQuotation,
}: PaymentTabContentProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
          <h3 className="text-sm font-medium text-gray-700">Payment Information</h3>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                isPaymentComplete ? "bg-green-100" : "bg-red-100"
              )}
            >
              <CreditCard
                className={cn("w-4 h-4", isPaymentComplete ? "text-green-600" : "text-red-600")}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Payment {isPaymentComplete ? "Completed" : "Pending"}
              </h4>
              <p className="text-xs text-gray-600">
                {isPaymentComplete
                  ? "Payment has been processed successfully."
                  : "Payment will be processed after accepting the quotation."}
              </p>
            </div>
          </div>
          {!isPaymentComplete && quotationId && (
            <Button onClick={onViewQuotation} className="w-full text-sm h-9">
              View & Accept Quotation
            </Button>
          )}
        </div>
      </div>

      {quotationId && (
        <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-blue-50/50 to-indigo-50/30">
            <h3 className="text-sm font-medium text-gray-700">Service Quotation</h3>
          </div>
          <div className="p-4">
            <div className="border rounded-lg overflow-hidden">
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
                    {quotationId.items.map((item, index) => (
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
                        {quotationId.total.toFixed(2)} INR
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}