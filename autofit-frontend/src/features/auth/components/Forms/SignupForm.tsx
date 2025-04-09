import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import GoogleLoginButton from '@/components/Auth/GoogleLoginButton';
import FormInput from '@/components/shared/FormInput';
import { useForm } from 'react-hook-form';
import { useSignupMutation } from '../../api/authApi';
import { toast } from 'react-toastify';
import OtpForm from './OtpForm';
import { Loader2 } from 'lucide-react';


type FormData ={
    name:string;
    email:string;
    password:string;
    mobile:string
}

const SignupForm : React.FC = () => {

    const [page, setPage] = useState<'signup'|'otp'>('signup')
    const {register,handleSubmit,formState:{errors}} = useForm<FormData>()
    const [signup, {isLoading,isError,isSuccess}] = useSignupMutation()


    const onValidSubmit = async (data: FormData) =>{
      try {
        const response = await signup(data).unwrap()
        setPage('otp')

      } catch (error) {
        console.log(error);
        const err = error as { data: { message: string } };
        toast.error(err.data.message)
      }
    }

  return (
    <>
     <div className="text-xs text-end">
        <span>Already registred?</span>
        <Link to="/login" className="text-blue-600 ml-1">Login Now</Link>
      </div>

      {page === 'signup' ?
      <div className="grid gap-2">
        
        <div className="flex flex-col justify-center items-center mt-6 mb-7">
          <h2 className="text-xl font-semibold">Hello, How are You?</h2>
          <h5 className="text-xs font-medium">Complete Your Reistration To start!</h5>
        </div>


          <FormInput id='name' label='Full Name' name='name' placeholder='Full name'  register={register} type='text'  error={errors.name} validationRule='name'/>
          <FormInput id="email" label="Email" type="email" placeholder="Email" register={register} error={errors.email} name='email' validationRule='email'/>
          <FormInput id="password" label="Password" type="password" placeholder="Password" error={errors.password} register={register} name='password' validationRule='password' />
          <FormInput id="mobile" label="Mobile Number" type="text" placeholder="Mobile number" error={errors.mobile} register={register} name='mobile' validationRule='mobile' />

          <Button onClick={handleSubmit(onValidSubmit)} className="bg-af_darkBlue mt-2" disabled={isLoading}>
          { isLoading ? <Loader2 className="animate-spin" /> : 'Signup'}
        </Button>

      </div> : <OtpForm/>}
    </>
  )
}

export default SignupForm