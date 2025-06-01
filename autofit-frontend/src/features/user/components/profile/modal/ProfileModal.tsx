import React, { SetStateAction, useEffect } from "react";
import { X,Loader2 } from "lucide-react";
import FormInput from "@/components/shared/formInput/FormInput";
import { useUpdateProfileMutation,ProfileData } from "@/features/user/api/profileApi";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { setUser } from "@/features/auth/slices/authSlice";

interface Props {
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface FormData {
  name: string;
  mobile: string;
  email: string;
}

const ProfileModal = ({ isProfileModalOpen, setIsProfileModalOpen }: Props) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [updateProfile,{isLoading}] = useUpdateProfileMutation()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user, reset]);

  const submit = async (data:ProfileData) => {
    try {
      const res = await updateProfile(data).unwrap()
      toast.success(res?.message)
      dispatch(setUser({...user,...res.data}))
      setIsProfileModalOpen(false);
    } catch (error:any) {
      toast.error(error?.data.message)
    }
  };


  return (
    <>
      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-white/50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="px-6 py-5 border-b border-white/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Edit Profile
                  </h3>
                  <button
                    onClick={() => setIsProfileModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors hover:bg-white/50"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <FormInput
                    id="name"
                    label="Full Name"
                    name="name"
                    placeholder="eg: Sara"
                    register={register}
                    type="text"
                    validationRule="name"
                    error={errors.name}
                  />
                </div>

                <div>
                  <FormInput
                    id="email"
                    label="email"
                    name="email"
                    placeholder="eg: sara@gmail.com"
                    register={register}
                    type="email"
                    validationRule="email"
                    error={errors.email}
                  />
                </div>

                <div>
                  <FormInput
                    id="mobile"
                    label="Mobile"
                    name="mobile"
                    placeholder="eg: 91 000 0000 000"
                    register={register}
                    type="tel"
                    validationRule="mobile"
                    error={errors.mobile}
                  />
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-white/30">
                <motion.button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 text-gray-700 rounded-lg hover:bg-white/70 transition-all font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  disabled={isLoading}
                  onClick={handleSubmit(submit)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                 {isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Save Changes'}
                </motion.button>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileModal;
