import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import GoogleLoginButton from '@/components/Auth/GoogleLoginButton';
import FormInput from '@/components/shared/FormInput';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../api/authApi';
import { Loader2 } from "lucide-react"
import { toast } from 'react-toastify';
import { ApiError } from '@/types/apiError';


type FormData = {
  email : string,
  password : string
}


const LoginForm: React.FC = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const [login,{isLoading,isError,isSuccess,data}] = useLoginMutation()


  const  onValidSubmit = async (data : FormData) =>{
    try {
      const res = await login(data).unwrap()
      console.log(res);
      

    } catch (error ) {
      const err = error as ApiError;
       toast.error(err.data.message ,{ position: "top-right", autoClose: 3000, hideProgressBar: true})
    }
    
  }

  return (
    <>
      <div className="text-xs text-end">
        <span>Not a Member?</span>
        <Link to="/signup" className="text-blue-600 ml-1">Register Now</Link>
      </div>

      <div className="flex flex-col justify-center items-center mt-8 mb-7">
        <h2 className="text-xl font-semibold">Hello Again!</h2>
        <h5 className="text-xs font-medium">Welcome back, you’ve been missed!</h5>
      </div>

      <div className="grid gap-2">

        <FormInput    id="email" label="Email" type="email" placeholder="Email" register={register} error={errors.email} name='email' validationRule='email'/>
        <FormInput id="password" label="Password" type="password" placeholder="Password" error={errors.password} register={register} name='password' validationRule='password'/>

        <Button onClick={handleSubmit(onValidSubmit)} className="bg-af_darkBlue mt-2" disabled={isLoading}>
          { isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
        </Button>

        <div className="text-xs text-end">
          <Link to="/forgot-password" className="text-blue-600">Forgot password?</Link>
        </div>

        <div className="flex items-center gap-4 my-4">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <GoogleLoginButton />
      </div>
    </>
  );
};

export default LoginForm;
