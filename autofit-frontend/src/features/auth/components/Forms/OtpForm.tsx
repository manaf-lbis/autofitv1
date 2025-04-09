import React, { useState } from 'react'
import OtpInput from '@/components/Auth/OtpInput'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { useVerifyOtpMutation } from '../../api/authApi'
import { Loader2 } from 'lucide-react'


const OtpForm = () => {
  const [otp, setOtp] = useState('')
  const [verifyOtp, { isSuccess, isLoading }] = useVerifyOtpMutation()



  const submitOtp = async () => {
    try {
      if (otp.length !== 6) {
        return toast.error('Invalid OTP')
      }

      const response = await verifyOtp(otp).unwrap()
      toast.success("OTP Verified Successfully!")
     
      
    } catch (error) {
      console.log(error)
      const err = error as { data: { message: string } }
      toast.error(err.data.message)
    }
  }

  return (
    <div className="min-h-[380px] flex items-center justify-center">
      <div className="w-full max-w-sm bg-white  p-8">
        <div className="flex flex-col justify-center items-center mb-6">
          <h2 className="text-xl font-semibold text-af_darkBlue">Enter OTP</h2>
          <p className="text-xs text-gray-500 text-center mt-1">
            An OTP has been sent to your email address.
          </p>
        </div>

        <div className="mb-4">
          <OtpInput state={otp} setState={setOtp} />
        </div>

        <div className="text-xs text-center mb-4">
            Didn't receive OTP?{' '}
            <button
                className="text-blue-600 ml-1 underline"
                // onClick={handleResendOtp}
                // disabled={isResending}
            >
                {/* {isResending ? 'Resending...' : 'Resend'} */}
            </button>
            </div>

        <Button
          onClick={submitOtp}
          className="w-full bg-af_darkBlue text-white"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Verify OTP'}
        </Button>
      </div>
    </div>
  )
}

export default OtpForm
