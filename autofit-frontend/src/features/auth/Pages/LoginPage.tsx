import AuthLayout from "../components/Layouts/AuthLayout";
import LoginForm from "../components/Forms/LoginForm";
import React from "react";
import AnimatedPage from "@/components/Animations/AnimatedPage";

const LoginPage: React.FC = () => {
  return (
    <AnimatedPage>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </AnimatedPage>
  );
};

export default LoginPage;
