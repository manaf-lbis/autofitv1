import React from 'react';
import { useParams } from 'react-router-dom';
import SignupForm from '@/features/auth/components/Forms/SignupForm';
import { Role } from '../components/Layouts/AuthLayout';
import AnimatedPage from '@/components/Animations/AnimatedPage';
import PasswordReset from '../components/Forms/PasswordReset';

const RoleForgotPassword: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const validRole = ['user', 'mechanic','admin'].includes(role || '') ? role as Role : 'user';

  console.log(role);
  

  return (
    <PasswordReset role={validRole} />
  );
};

export default RoleForgotPassword;