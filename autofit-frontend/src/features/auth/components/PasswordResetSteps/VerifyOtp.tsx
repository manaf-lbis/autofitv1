import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OtpInput from '@/components/Auth/OtpInput';
import { Role } from '@/utils/roleConfig';
import { useResentOtpMutation, useVerifyOtpMutation } from '../../api/passwordResetApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CountdownTimer from '@/components/shared/CoundDownTimer';
import toast from 'react-hot-toast';


interface VerifyOtpProps {
  setStep: (step: number) => void;
  role: Role;
  email: string;
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({ setStep, role, email }) => {
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resentOtp , {isLoading:resentLoading}] = useResentOtpMutation();

  const [error, setError] = useState<any | null>(null);
  const [otp, setOtp] = useState<string>('');
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  const handleOtpSubmit = async () => {
    setError(null);
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      await verifyOtp({ otp, role }).unwrap();
      setStep(2); 
    } catch (error: any) {
      setError(error.data || 'Invalid verification code');
    }
  };

  const handleResend =async () => {
    try {
      await resentOtp({role}).unwrap()
      toast.success('OTP Sended')
      setResendDisabled(true);
      setCountdown(10);
    } catch (error:any) {
      toast.error(error.data?.message) 
    }
    
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => {
        clearTimeout(timer);
      };
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleTimer = ()=>{
    setError(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="text-center mb-6 relative">
        <button 
          onClick={() => setStep(0)} 
          className="absolute left-0 top-1 p-1 text-gray-500 hover:text-indigo-600 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
          <KeyRound className="h-6 w-6 text-indigo-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Verification Code
        </h2>
        
        <p className="text-gray-600">
          We've sent a 6-digit code to {email}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
        <OtpInput state={otp} setState={setOtp}/>
        </div>
        
        {error && (
          <Alert variant="destructive" className="bg-red-50 border border-red-200">
            <AlertDescription className="text-red-600">
            {error.message}
            {error.data?.remainingTime && <CountdownTimer onComplete={handleTimer} className="text-red-600 font-semibold" remainingTime={error.data?.remainingTime}/>}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-center text-sm">
          <span className="text-gray-600">Didn't receive the code?</span>
          <button
            onClick={handleResend}
            disabled={resendDisabled}
            className={`ml-2 font-medium ${resendDisabled ? 'text-gray-400' : 'text-indigo-600 hover:text-indigo-800'} transition-colors`}
          >
            {resentLoading ? ( <Loader2 className="animate-spin w-4 h-4 text-gray-600"/>) : ( resendDisabled ? `Resend in ${countdown}s` : 'Resend')}

          </button>
        </div>

        <Button
          onClick={handleOtpSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-all duration-300"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </div>
          ) : "Verify Code"}
        </Button>
      </div>
    </motion.div>
  );
};

export default VerifyOtp;