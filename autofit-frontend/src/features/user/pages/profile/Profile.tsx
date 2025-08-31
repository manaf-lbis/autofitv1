import { motion } from "framer-motion";
import ProfileCard from "../../components/profile/ProfileCard";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 backdrop-blur-3xl rounded-full border border-blue-200/30"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-violet-500/10 backdrop-blur-3xl rounded-full border border-violet-200/30"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto md:py-16 md:px-6 pb-20 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your personal information and addresses
          </p>
        </motion.div>

        <ProfileCard />
        {/* <AddressCard /> */}
      </div>
    </div>
  );
};

export default Profile;
