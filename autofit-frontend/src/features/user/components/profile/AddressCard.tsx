import React, { useState } from "react";
import { motion,AnimatePresence } from "framer-motion";
import { X ,Edit,Plus,MapPin,Star,Trash,Home,Building} from "lucide-react";
import AddressModal from "./modal/AddressModal";


export interface Address {
  id: string;
  type: "home" | "work" | "other";
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const getAddressIcon = (type: string) => {
switch (type) {
    case "home":
    return Home
    case "work":
    return Building
    default:
    return MapPin
}
}

const initialAddresses: Address[] = [
  {
    id: "1",
    type: "home",
    label: "Home",
    street: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    isDefault: true,
  },
];

const AddressCard = () => {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    type: "home",
    label: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    isDefault: false,
  });

  // Address handlers
  const handleAddAddress = () => {
    setEditingAddress(null)
    setAddressForm({
      type: "home",
      label: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      isDefault: false,
    })
    setIsAddressModalOpen(true)
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressForm(address)
    setIsAddressModalOpen(true)
  }

 

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
  }


  return (
    <>

            {/* Addresses */}
        <motion.div
          className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="px-8 py-6 border-b border-white/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Addresses</h2>
                <span className="bg-white/50 backdrop-blur-sm text-gray-600 text-sm px-3 py-1 rounded-full font-medium border border-white/60">
                  {addresses.length}
                </span>
              </div>
              <motion.button
                onClick={handleAddAddress}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm flex items-center gap-2 text-sm font-medium transition-colors shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={16} />
                Add Address
              </motion.button>
            </div>
          </div>

          {addresses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/60">
                <MapPin size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-600 mb-6">Add your first address to get started</p>
              <motion.button
                onClick={handleAddAddress}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add your first address
              </motion.button>
            </div>
          ) : (
            <div className="p-6">
              {/* Scrollable Address List */}
              <div className="max-h-80 overflow-y-auto space-y-3 custom-scrollbar">
                {addresses.map((address, index) => {
                  const IconComponent = getAddressIcon(address.type)
                  return (
                    <motion.div
                      key={address.id}
                      className="relative group bg-white/50 backdrop-blur-sm hover:bg-white/70 border border-white/60 hover:border-white/80 rounded-xl p-5 transition-all duration-300 shadow-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      {/* Default badge */}
                      {address.isDefault && (
                        <motion.div
                          className="absolute -top-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                        >
                          <Star size={12} fill="currentColor" />
                        </motion.div>
                      )}

                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-white/70 backdrop-blur-sm border border-white/80 rounded-xl flex items-center justify-center">
                          <IconComponent size={20} className="text-gray-600" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{address.label}</h3>
                            <span className="bg-white/70 backdrop-blur-sm border border-white/80 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                              {address.type}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-1">{address.street}</p>
                          <p className="text-gray-500 text-sm">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-gray-500 text-sm">{address.country}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {!address.isDefault && (
                            <motion.button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Set as default"
                            >
                              <Star size={16} />
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => handleEditAddress(address)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit address"
                          >
                            <Edit size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete address"
                          >
                            <Trash size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              {/* Scroll indicator */}
              {addresses.length > 3 && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">Scroll to see more addresses</p>
                </div>
              )}
            </div>
            
          )}
        </motion.div>

        {isAddressModalOpen && (<AddressModal editingAddress={editingAddress} setModalOpen={setIsAddressModalOpen} />)}

    </>
  )
  
};

export default AddressCard;
