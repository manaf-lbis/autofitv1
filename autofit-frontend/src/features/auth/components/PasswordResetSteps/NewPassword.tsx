import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/shared/formInput/FormInput';
import { useForm } from 'react-hook-form';
import { Role } from '@/utils/roleConfig';
import { useSetNewPasswordMutation } from '../../api/passwordResetApi';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewPasswordProps {
  setStep: (step: number) => void;
  role: Role;
}

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

const NewPassword: React.FC<NewPasswordProps> = ({ setStep, role }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PasswordFormData>();
  const [error, setError] = useState<string | null>(null);
  const [setPassword, { isLoading }] = useSetNewPasswordMutation();

  const password = watch('password', '');
  

  const getPasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };
  
  const passwordStrength = getPasswordStrength(password);

  const handlePasswordReset = async (data: PasswordFormData) => {
    setError(null);
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await setPassword({ password: data.password, role }).unwrap();
      setStep(3); 
    } catch (error: any) {
      setError(error.data?.message || 'Unknown Error');
    }
  };

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
          onClick={() => setStep(1)} 
          className="absolute left-0 top-1 p-1 text-gray-500 hover:text-indigo-600 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
          <Lock className="h-6 w-6 text-indigo-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Create New Password
        </h2>
        
        <p className="text-gray-600">
          Your password must be different from previously used passwords
        </p>
      </div>

      <form onSubmit={handleSubmit(handlePasswordReset)} className="space-y-5">
        <div>
        <FormInput id='password' label='Password' name='password' placeholder='New Password' register={register} type='password' validationRule='password' error={errors.password} />
          
          {password && (
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">Password strength:</span>
                <span className="text-xs font-medium">
                  {passwordStrength === 0 && "Very weak"}
                  {passwordStrength === 1 && "Weak"}
                  {passwordStrength === 2 && "Medium"}
                  {passwordStrength === 3 && "Strong"}
                  {passwordStrength === 4 && "Very strong"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${
                    passwordStrength <= 1 ? 'bg-red-500' : 
                    passwordStrength === 2 ? 'bg-yellow-500' : 
                    passwordStrength === 3 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${passwordStrength * 25}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <FormInput id='cPassword' label='Confirm Password' name='confirmPassword' placeholder='Confirm Password' register={register} type='password' validationRule='password' error={errors.confirmPassword} />
        
        {error && (
          <Alert variant="destructive" className="bg-red-50 border border-red-200">
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </div>
          ) : "Reset Password"}
        </Button>
      </form>
    </motion.div>
  );
};

export default NewPassword;