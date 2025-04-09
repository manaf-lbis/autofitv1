import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import GoogleLoginButton from '@/components/Auth/GoogleLoginButton';
import FormInput from '../shared/FormInput';

const LoginForm: React.FC = () => {
  return (
    <>
      <div className="text-xs text-end">
        <span>Not a Member?</span>
        <Link to="/register" className="text-blue-600 ml-1">Register Now</Link>
      </div>

      <div className="flex flex-col justify-center items-center mt-6 mb-10">
        <h2 className="text-xl font-semibold">Hello Again!</h2>
        <h5 className="text-xs font-medium">Welcome back, you’ve been missed!</h5>
      </div>

      <div className="grid gap-3">
        <FormInput id="email" label="Email" type="email" placeholder="Email" />
        <FormInput id="password" label="Password" type="password" placeholder="Password" />

        <Button className="bg-af_darkBlue mt-2">Login</Button>

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
