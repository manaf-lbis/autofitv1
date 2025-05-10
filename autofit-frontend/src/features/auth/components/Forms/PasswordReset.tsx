import { useState } from 'react';
import { Role } from '@/utils/roleConfig';
import af_logo from '@/assets/common/af_logo_b_text.png';

// Import the step components
import VerifyEmail from '../PasswordResetSteps/VerifyEmail';
import VerifyOtp from '../PasswordResetSteps/VerifyOtp';
import NewPassword from '../PasswordResetSteps/NewPassword';
import Success from '../PasswordResetSteps/Success';
import { useNavigate } from 'react-router-dom';

// Define step constants
const STEPS = {
  EMAIL: 0,
  OTP: 1,
  NEW_PASSWORD: 2,
  SUCCESS: 3
};

interface PasswordResetProps {
  role: Role;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ role }) => {
  const [currentStep, setCurrentStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate()

  // Company logo component
  const CompanyLogo = () => (
    <div className="flex justify-center mb-6">
      <div className="flex flex-col items-center">
        <img src={af_logo} alt="Company Logo" className="h-12 mb-2" />
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <CompanyLogo />
        
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          
          {currentStep === STEPS.EMAIL && (
            <VerifyEmail 
              setStep={(step) => setCurrentStep(step)} 
              role={role} 
              setEmail={setEmail}
            />
          )}
          
          {currentStep === STEPS.OTP && (
            <VerifyOtp 
              setStep={(step) => setCurrentStep(step)} 
              role={role} 
              email={email}
            />
          )}
          
          {currentStep === STEPS.NEW_PASSWORD && (
            <NewPassword 
              setStep={(step) => setCurrentStep(step)} 
              role={role} 
            />
          )}
          
          {currentStep === STEPS.SUCCESS && (
            <Success 
              role={role} 
            />
          )}
        </div>

        {currentStep !== STEPS.SUCCESS && (
          <div className="mt-6 text-center">
            <button
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={()=>navigate(`/auth/${role}/login`,{replace:true})}
            >
              <span className='text-black'>Remember your password? </span>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;