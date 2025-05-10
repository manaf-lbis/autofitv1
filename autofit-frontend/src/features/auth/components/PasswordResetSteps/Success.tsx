import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Role } from '@/utils/roleConfig';
import { useNavigate } from 'react-router-dom';

interface SuccessProps {
  role: Role;
}

const Success: React.FC<SuccessProps> = ({ role }) => {

  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      handleBackToLogin();
    }, 5000);
    
    return () => clearTimeout(redirectTimer);
  }, []);

  const handleBackToLogin = () => {
    navigate(`/auth/${role}/login`,{replace:true})
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full text-center py-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle className="h-10 w-10 text-green-600" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-800 mb-4"
      >
        Password Reset Complete
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-8"
      >
        Your password has been reset successfully. You can now login with your new password.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5 }}
              className="bg-green-500 h-2 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Redirecting to login page...</p>
        </div>
        
        <Button
          onClick={handleBackToLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-all duration-300"
        >
          Back to Login
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Success;