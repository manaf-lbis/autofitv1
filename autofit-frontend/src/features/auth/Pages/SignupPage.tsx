import React from 'react'
import AuthLayout from '../components/Layouts/AuthLayout'
import SignupForm from '../components/Forms/SignupForm'


const SignupPage :React.FC = () => {
  return (
    <AuthLayout>
        <SignupForm/>
    </AuthLayout>
  )
}

export default SignupPage