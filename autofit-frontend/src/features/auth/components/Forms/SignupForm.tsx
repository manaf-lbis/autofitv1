import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import FormInput from '@/components/shared/formInput/FormInput';
import { useForm } from 'react-hook-form';
import { useSignupMutation } from '@/features/auth/api/authApi';
import { toast } from 'react-toastify';
import OtpForm from '@/features/auth/components/Forms/OtpForm';
import { Loader2 } from 'lucide-react';
import { ApiError } from '@/types/apiError';
import { Role } from '../Layouts/AuthLayout';

interface Props { role: Exclude<Role, 'admin'>; }

type FormData = { name: string; email: string; password: string; mobile: string };

const SignupForm: React.FC<Props> = ({ role }) => {
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [signup, { isLoading }] = useSignupMutation();

  const onValid = async (data: FormData) => {
    try {
      await signup({ ...data, role }).unwrap();
      setStep('otp');
    } catch (err) {
      const e = err as ApiError;
      toast.error(e.data.message);
    }
  };

  return (
    <>
      <div className="text-xs text-end">
        <span>Already registered?</span> <Link to={`/${role}/login`} className="text-blue-600 ml-1">Login Now</Link>
      </div>
      {step === 'signup' ? (
        <div className="grid gap-2">

<div className="flex flex-col justify-center items-center mt-6 mb-7">
       <h2 className="text-xl font-semibold">Hello, How are You?</h2>
          <h5 className="text-xs font-medium">Complete Your Reistration To start!</h5>
       </div>

          <FormInput id="name" label="Full Name" type="text" placeholder="Full name" register={register} name="name" validationRule="name" error={errors.name} />
          <FormInput id="email" label="Email" type="email" placeholder="Email" register={register} name="email" validationRule="email" error={errors.email} />
          <FormInput id="password" label="Password" type="password" placeholder="Password" register={register} name="password" validationRule="password" error={errors.password} />
          <FormInput id="mobile" label="Mobile Number" type="tel" placeholder="Mobile number" register={register} name="mobile" validationRule="mobile" error={errors.mobile} />
          <Button onClick={handleSubmit(onValid)} className="bg-af_darkBlue mt-2" disabled={isLoading}>
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