import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import FormInput from '@/components/shared/formInput/FormInput';
import { useForm } from 'react-hook-form';
import { useSignupMutation } from '@/services/authServices/authApi';
import { toast } from 'react-toastify';
import OtpForm from '@/features/auth/components/Forms/OtpForm';
import { Loader2, X } from 'lucide-react';
import { ApiError } from '@/types/apiError';
import { Role } from '../Layouts/AuthLayout';

interface Props {
  role: Exclude<Role, 'admin'>;
}

type FormData = {
  name: string;
  email: string;
  password: string;
  mobile: string;
  confirmPassword: string;
};

const SignupForm: React.FC<Props> = ({ role }) => {
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [signup, { isLoading }] = useSignupMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onValid = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setErrorMessage('Confirm Passwords do not match');
      return;
    }

    try {
      const { name, email, password, mobile } = data;
      await signup({ name, email, password, mobile, role }).unwrap();
      setStep('otp');
      setErrorMessage(null);
    } catch (err) {
      const e = err as ApiError;
      setErrorMessage(e.data.message)
    }
  };

  return (
    <>
      <div className="text-xs text-end">
        <span>Already registered?</span> <Link to={`/auth/${role}/login`} className="text-blue-600 ml-1">Login Now</Link>
      </div>
      {step === 'signup' ? (
        <div className="relative flex flex-col bg-white rounded-lg shadow-sm">

            <div className="flex flex-col justify-center items-center my-7">
              <h2 className="text-xl font-semibold">Hello, How are You?</h2>
              <h5 className="text-xs font-medium">Complete Your Registration To start!</h5>
            </div>


              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  errorMessage ? 'max-h-20 opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'
                }`}
              >
                <div className="flex items-center justify-between bg-red-100 text-red-800 p-3 rounded-md transform transition-transform duration-300">
                  <span className="text-sm">{errorMessage}</span>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-red-800 hover:text-red-900 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <FormInput
                id="name"
                label="Full Name"
                type="text"
                placeholder="Full name"
                register={register}
                name="name"
                validationRule="name"
                error={errors.name}
              />
              <FormInput
                id="email"
                label="Email"
                type="email"
                placeholder="Email"
                register={register}
                name="email"
                validationRule="email"
                error={errors.email}
              />
              <div className='flex gap-2'>
                 <FormInput
                id="password"
                label="Password"
                type="password"
                placeholder="Password"
                register={register}
                name="password"
                validationRule="password"
                error={errors.password}
              />
              <FormInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-Enter Password"
                register={register}
                name="confirmPassword"
                validationRule="password"
                error={errors.confirmPassword}
              />
              </div>
             
              <FormInput
                id="mobile"
                label="Mobile Number"
                type="tel"
                placeholder="Mobile number"
                register={register}
                name="mobile"
                validationRule="mobile"
                error={errors.mobile}
              />


            <Button
              onClick={handleSubmit(onValid)}
              className="bg-af_darkBlue w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Signup'}
            </Button>
          </div>

      ) : (
        <OtpForm role={role} />
      )}
    </>
  );
};

export default SignupForm;