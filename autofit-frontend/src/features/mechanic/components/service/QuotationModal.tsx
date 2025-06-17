import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTrigger,DialogDescription, DialogTitle  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Receipt, X } from "lucide-react"

interface QuotationItem {
  id: string
  name: string
  price: number | ""
  quantity: number | ""
  total: number
  isValid: boolean
}

export interface QuotationData {
  items: QuotationItem[]
  notes: string
  totalAmount: number
}

interface QuotationModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: QuotationData) => void
  triggerButton?: React.ReactNode
}

export default function QuotationModal({ isOpen, onOpenChange, onSubmit, triggerButton }: QuotationModalProps) {
  const [items, setItems] = useState<QuotationItem[]>([
    { id: "1", name: "", price: "", quantity: "", total: 0, isValid: false },
  ])
  const [notes, setNotes] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)

  // Validate items and calculate totals
  useEffect(() => {
    const updatedItems = items.map((item) => {
      const price = Number(item.price) || 0
      const quantity = Number(item.quantity) || 0
      const total = price * quantity
      const isValid = item.name.trim() !== "" && price > 0 && quantity > 0

      return { ...item, total, isValid }
    })

    setItems(updatedItems)
    setIsFormValid(updatedItems.every((item) => item.isValid) && updatedItems.length > 0)
  }, [items.map((item) => `${item.name}-${item.price}-${item.quantity}`).join(",")])

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      name: "",
      price: "",
      quantity: "",
      total: 0,
      isValid: false,
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = () => {
    if (!isFormValid) return

    const quotationData: QuotationData = {
      items: items.filter((item) => item.isValid),
      notes,
      totalAmount: getTotalAmount(),
    }

    onSubmit(quotationData)
    onOpenChange(false)

    // Reset form
    setItems([{ id: "1", name: "", price: "", quantity: "", total: 0, isValid: false }])
    setNotes("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}

      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-0 flex flex-col rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-col">
            <DialogTitle className="text-xl font-semibold text-gray-900">
                Create Quotation
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 ">
                Fill in the details below to generate a quotation.
            </DialogDescription>
            </div>
        
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={addItem}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 focus:outline-none mr-5"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 transition-all ${
                  item.isValid ? "border-green-200 bg-green-50/50" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Item {index + 1}</h3>
                  {items.length > 1 && (
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 h-8 w-8 p-0 focus:outline-none"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Item Name */}
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Service Name *</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      placeholder="e.g., Oil Change, Brake Repair"
                      className={`w-full focus:outline-none ${
                        item.name.trim() === ""
                          ? "border-red-300 focus:border-red-500"
                          : "border-green-300 focus:border-green-500"
                      }`}
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Price (₹) *</Label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className={`w-full focus:outline-none ${
                        Number(item.price) <= 0
                          ? "border-red-300 focus:border-red-500"
                          : "border-green-300 focus:border-green-500"
                      }`}
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Quantity *</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                      placeholder="1"
                      min="1"
                      className={`w-full focus:outline-none ${
                        Number(item.quantity) <= 0
                          ? "border-red-300 focus:border-red-500"
                          : "border-green-300 focus:border-green-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="mt-4 flex justify-end">
                  <div className="bg-gray-50 px-4 py-2 rounded-lg border">
                    <span className="text-sm text-gray-600 mr-2">Total:</span>
                    <span className="font-bold text-lg text-gray-900">₹{item.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Notes Section */}
            <div className="border rounded-lg p-4 bg-blue-50/30">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Additional Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Warranty information, terms & conditions, special instructions..."
                rows={3}
                className="w-full focus:outline-none border-blue-200 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 shrink-0">
          {/* Total Amount */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700 font-medium">Grand Total</p>
                <p className="text-sm text-gray-500">{items.filter((item) => item.isValid).length} item(s)</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">₹{getTotalAmount().toFixed(2)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={() => onOpenChange(false)} variant="outline" className="flex-1 focus:outline-none">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`flex-1 focus:outline-none ${
                isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Generate Quotation
            </Button>
          </div>

          {!isFormValid && <p className="text-sm text-red-600 mt-2 text-center">Please complete all required fields</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
