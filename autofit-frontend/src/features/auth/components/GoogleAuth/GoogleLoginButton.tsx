import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import googleLogo from "@/assets/common/googleLogo.webp";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleLoginMutation } from "@/features/auth/api/authApi";
import { setUser, setError } from "@/features/auth/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleLoading from "@/components/Animations/GoogleLogin";
import { Role } from "../Layouts/AuthLayout";
import { roleConfig } from "@/utils/roleConfig";

type GoogleButtonProps = { role: Role };

type GoogleResponse = { code: string };

const GoogleLoginButton: React.FC<GoogleButtonProps> = ({ role }) => {
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const [googleSigningIn, setGoogleSigningIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async ({ code }: GoogleResponse) => {
    try {
      const res = await googleLogin({ code, role }).unwrap();
      if (res.status === "success") {
        dispatch(setUser({ name: res.data.name, role: res.data.role ,email:res.data.email}));
        localStorage.setItem('userRole', res.data.role);
        navigate(roleConfig[res.data.role].defaultRoute, { replace: true });
        toast.success("Logged in with Google!");
      }
    } catch (err) {
      const error = err as { data?: { message: string } };
      dispatch(setError(error.data?.message || "Google login failed"));
      toast.error(error.data?.message || "Google login failed");
    } finally {
      setGoogleSigningIn(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    flow: "auth-code",
    scope: "email profile",
  });

  return (
    <Button
      onClick={() => {
        setGoogleSigningIn(true);
        login();
      }}
      className="bg-white flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
      disabled={isLoading || googleSigningIn}
    >
      {(isLoading || googleSigningIn) ? (
        <GoogleLoading />
      ) : (
        <>
          <img src={googleLogo} alt="Google logo" className="h-5 w-5" />
          <p className="text-sm text-gray-700 font-medium">Continue with Google</p>
        </>
      )}
    </Button>
  );
};

export default GoogleLoginButton;