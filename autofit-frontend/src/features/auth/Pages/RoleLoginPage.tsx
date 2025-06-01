import React from 'react';
import { useParams } from 'react-router-dom';
import LoginForm from '@/features/auth/components/Forms/LoginForm';
import AuthLayout, { Role } from '../components/Layouts/AuthLayout';
import AnimatedPage from '@/components/Animations/AnimatedPage';
import Footer from '../components/Footer';

const RoleLoginPage: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const validRole = ['user', 'admin', 'mechanic'].includes(role || '') ? role as Role : 'user';

  return (
    <>
      <AnimatedPage>
        <AuthLayout role={validRole}>
          <LoginForm role={validRole} />
        </AuthLayout>
      </AnimatedPage>
      <Footer />
    </>
  );
};

export default RoleLoginPage;