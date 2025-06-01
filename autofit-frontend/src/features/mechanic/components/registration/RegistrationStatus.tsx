import { Button } from '@/components/ui/button';
import { useLogoutMutation } from '@/features/auth/api/authApi';
import { ApiError } from '@/types/apiError';
import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RegistrationStatus = () => {
  const [logout,{isLoading}] = useLogoutMutation()
  const navigate = useNavigate()

const handleLogout = async () =>{
  try {
    const response = await logout()
    toast.success('Logout Success')
    navigate('/auth/mechanic/login',{replace:true})
  } catch (error) {
    toast.error('Logout Failed')
  }
}

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>


        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Application Submitted Successfully!
        </h1>


        <p className="text-gray-600 mb-6">
          Your registration is currently <span className="font-medium text-blue-600">under process</span>. We will notify you once it's completed.
        </p>


       <Button onClick={handleLogout} >Logout</Button>
      </div>
    </div>
  );
};

export default RegistrationStatus;