import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import EmailStep from '../Steps/EmailStep';
import OtpStep from '../Steps/OtpStep';
import NewPassword from '../Steps/NewPassword';

const ForgotPasswordCard = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'password' >('email');

  return (
    <Card className="w-[400px] h-[300px] relative overflow-hidden p-3">
      <CardContent>

        {/* step 1 verify email*/}

          {step === 'email' && (
            <motion.div
              key="email"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <EmailStep onVerified={() => setStep('otp')} />
            </motion.div>
          )}

          {/* step 2 Eter otp */}

          {step === 'password' && (
            <motion.div
              key="otp"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <OtpStep />
            </motion.div>
          )}

          {/* step3 new Password */}

          
          {step === 'otp' && (
            <motion.div
              key="password"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <NewPassword />
            </motion.div>
          )}




      </CardContent>
    </Card>
  );
};

export default ForgotPasswordCard;