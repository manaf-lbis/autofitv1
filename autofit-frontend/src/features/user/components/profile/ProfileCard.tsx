import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit,Mail,Phone,Clock,User } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import ProfileModal from './modal/ProfileModal'


interface UserProfile {
  name: string
  email: string
  phone: string
  lastActive: string
}

const initialProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  lastActive: "2 hours ago",
}

const ProfileCard = () => {
 
  const [profile] = useState<UserProfile>(initialProfile)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const {user} = useSelector((state:RootState)=>state.auth)
  
  

  const handleEditProfile = () => {
    setIsProfileModalOpen(true)
  }


  return (
    <>
        <motion.div
          className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="px-8 py-6 border-b border-white/30">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              <motion.button
                onClick={handleEditProfile}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium transition-colors bg-white/50 hover:bg-white/70 px-3 py-2 rounded-lg border border-white/60"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit size={16} />
                Edit
              </motion.button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/60">
                    <User className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Full Name</p>
                    <p className="text-lg font-medium text-gray-900">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/60">
                    <Phone className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                    <p className="text-lg font-medium text-gray-900">{user?.mobile}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/60">
                    <Mail className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                    <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/60">
                    <Clock className="text-gray-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Last Active</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-lg font-medium text-gray-900">{profile.lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <ProfileModal isProfileModalOpen={isProfileModalOpen} setIsProfileModalOpen={setIsProfileModalOpen} />
    </>
  )
}

export default ProfileCard