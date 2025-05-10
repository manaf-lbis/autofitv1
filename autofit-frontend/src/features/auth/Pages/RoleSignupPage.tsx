import React from 'react';
import { useParams } from 'react-router-dom';
import SignupForm from '@/features/auth/components/Forms/SignupForm';
import AuthLayout, { Role } from '../components/Layouts/AuthLayout';
import AnimatedPage from '@/components/Animations/AnimatedPage';

const RoleSignupPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const validRole = ['user', 'mechanic'].includes(role || '') ? role as Role : 'user';

  return (
    <AnimatedPage>
      <AuthLayout role={validRole}>
        <SignupForm role={validRole as 'user' | 'mechanic'} />
      </AuthLayout>
    </AnimatedPage>
  );
};

export default RoleSignupPage;