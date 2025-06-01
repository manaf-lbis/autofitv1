import React from 'react'
import { AnimatePresence,motion } from 'framer-motion'
import { Address } from '../AddressCard'
import { X } from 'lucide-react'
import FormInput from '@/components/shared/formInput/FormInput'

interface InputProp{
    setModalOpen:React.Dispatch<React.SetStateAction<boolean>>;
    editingAddress:Address|null
}

const AddressModal = ({setModalOpen,editingAddress}:InputProp) => {

  const handleSaveAddress = () => {
    if (editingAddress) {
        console.log('edit address logic');
    } else {
        console.log('new address logic');
    }
    setModalOpen(false)
  }


  return (
    <>
      {/* Address Modal */}
      <AnimatePresence>
        
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-white/50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="px-6 py-5 border-b border-white/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingAddress ? "Edit Address" : "Add New Address"}
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors hover:bg-white/50"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-160px)] custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    select home / office
                   {/* <FormInput /> */}
                  </div>

                  <div>
                     inut
                   {/* <FormInput /> */}
                  </div>
                </div>

                <div>
                   street
                   {/* <FormInput /> */}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                     scity
                   {/* <FormInput /> */}
                  </div>

                  <div>
                     state
                   {/* <FormInput /> */}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    pin
                   {/* <FormInput /> */}
                  </div>

                  <div>
                    country
                   {/* <FormInput /> */}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/60">
                  <input
                    type="checkbox"
                    id="isDefault"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                    Set as default address
                  </label>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-white/30">
                <motion.button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 text-gray-700 rounded-lg hover:bg-white/70 transition-all font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSaveAddress}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {editingAddress ? "Update Address" : "Add Address"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
      
      </AnimatePresence>
    </>
  )
}

export default AddressModal