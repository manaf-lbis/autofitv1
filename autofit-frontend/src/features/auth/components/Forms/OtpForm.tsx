import React, { useState } from 'react'
import OtpInput from '@/components/Auth/OtpInput'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { useResentOtpMutation, useVerifyOtpMutation } from '../../api/authApi'
import { Loader2 } from 'lucide-react'
import { ApiError } from '@/types/apiError'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../slices/authSlice'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import CountdownTimer from '@/components/shared/CoundDownTimer'

const RESEND_WAIT_TIME = 30

const OtpForm = () => {
  const [otp, setOtp] = useState('')
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation()
  const [resentOtp, { isLoading: resentLoading }] = useResentOtpMutation()
  const [error, setError] = useState<any | null>(null)
  const [countdown, setCountdown] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const submitOtp = async () => {
    try {
      setError(null) 
      if (otp.length !== 6) return toast.error('Invalid OTP')

      const response = await verifyOtp({ otp }).unwrap()
      if (response) {
        const { name, role } = response.data
        toast.success('OTP Verified Successfully!')
        dispatch(setUser({ name, role }))
        navigate('/')
      }
    } catch (error) {
      const err = error as ApiError
      setError(err.data) 
    }
  }

  const handleResend = async () => {
    try {
      setError(null) 
      const res = await resentOtp({}).unwrap()
      toast.success(res.message || 'OTP resent successfully!')
      setCountdown(RESEND_WAIT_TIME)
    } catch (error: any) {
      setError(error.data)
      toast.error(error?.data?.message || 'Failed to resend OTP')
    }
  }
  const handleTimer=()=>{
    setError(null)
  }

  return (
    <div className="min-h-[380px] flex items-center justify-center">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col justify-center items-center mb-6">
          <h2 className="text-xl font-semibold text-af_darkBlue">Enter OTP</h2>
          <p className="text-xs text-gray-500 text-center mt-1">
            An OTP has been sent to your email address.
          </p>
        </div>

        <div className="mb-4">
          <OtpInput
            state={otp}
            setState={(val) => {
              setOtp(val)
              setError(null) 
            }}
          />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {/* {error.message || 'Something went wrong'} */}
              {error.message}
              {error.data?.remainingTime && <CountdownTimer onComplete={handleTimer} className="text-red-600 font-thin" remainingTime={error.data?.remainingTime}/>}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center text-sm mb-4">
          <span className="text-gray-600">Didn't receive the code?</span>
          <button
            onClick={handleResend}
            disabled={resentLoading || countdown > 0}
            className={`ml-2 font-medium transition-colors ${
              countdown > 0 || resentLoading
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-indigo-600 hover:text-indigo-800'
            }`}
          >
            {resentLoading ? (
              <Loader2 className="animate-spin w-4 h-4 text-gray-600" />
            ) : countdown > 0 ? (
              <CountdownTimer
                remainingTime={countdown}
                onComplete={() => setCountdown(0)}
              />
            ) : (
              'Resend'
            )}
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