import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useState } from 'react';
import { CardHeader,CardTitle,CardDescription } from '@/components/ui/card';

const OtpStep = () => {

  const [otp,setOtp] = useState('')


  return (
    <div className="flex flex-col gap-10">
    

      <CardHeader className='p-0 pt-5'>
        <CardTitle>Enter OTP</CardTitle>
        <CardDescription>We sent a code to your email.</CardDescription>
      </CardHeader>

      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <button className="bg-black text-white w-full py-2 rounded-md">Confirm</button>
    </div>
  );
};

export default OtpStep;