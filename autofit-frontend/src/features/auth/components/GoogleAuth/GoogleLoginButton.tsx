import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import googleLogo from "@/assets/common/googleLogo.webp";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleLoginMutation } from "@/features/auth/api/authApi";
import { setUser } from "@/features/auth/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/types/apiError";
import { toast } from "react-toastify";
import GoogleLoading from "../../../../components/Animations/GoogleLogin";

type GoogleButtonProps = {
  role: "mechanic" | "user";
};

type GoogleResponse = {
  code: string;
};

const GoogleLoginButton: React.FC<GoogleButtonProps> = ({ role }) => {
  const [googleLogin, { isLoading, isError, isSuccess }] = useGoogleLoginMutation();
  const [googleSigningIn, setGoogleSigningIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response: GoogleResponse) => {
    try {
      const res = await googleLogin({ code: response.code, role }).unwrap();
      
      if (res.status === "success") {
        const { name, role } = res.data;
        dispatch(setUser({ name, role }));
        navigate("/");
      }
    } catch (error) {
      const err = error as ApiError;
      toast.error(err?.data?.message, { position: "top-right", autoClose: 3000, hideProgressBar: true });
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
        login();
        setGoogleSigningIn(true);
      }}
      className="bg-white flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
    >
      {googleSigningIn || isLoading ? (
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