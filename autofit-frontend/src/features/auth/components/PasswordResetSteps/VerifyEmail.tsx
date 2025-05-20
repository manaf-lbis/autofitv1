import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/formInput/FormInput";
import { useForm } from "react-hook-form";
import { useVerifyEmailMutation } from "../../api/passwordResetApi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Role } from "@/utils/roleConfig";
import CountdownTimer from "@/components/shared/CoundDownTimer";


interface VerifyEmailProps {
  setStep: (step: number) => void;
  role: Role;
  setEmail: (email: string) => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ setStep, role, setEmail }) => {
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [error, setError] = useState< any | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();

  const onValidSubmit = async (data: { email: string }) => {
    try {
      setError(null);
      await verifyEmail({ email: data.email, role }).unwrap();
      setEmail(data.email);
      setStep(1); 

    } catch (error: any) {
      setError(error.data);
    }
  };

  const handleTimer = ()=>{
    setError(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
          <Mail className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-600">
          Enter your email to receive a verification code
        </p>
      </div>

      <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
      <FormInput
        id="email"
        label="Email"
        name="email"
        placeholder="Email Address"
        register={register}
        type="email"
        validationRule="email"
        error={errors.email}
      />

        {error && (
          <Alert variant="destructive" className="bg-red-50 border border-red-200">
            <AlertDescription className="text-red-600">
              {error.message}
              {error.data?.remainingTime && <CountdownTimer onComplete={handleTimer} className="text-red-600 font-thin" remainingTime={error.data?.remainingTime}/>}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </div>
          ) : "Continue"}
        </Button> 
        
      </form>
    </motion.div>
  );
};

export default VerifyEmail;


