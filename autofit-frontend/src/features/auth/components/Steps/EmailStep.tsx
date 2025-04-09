import { useForm } from 'react-hook-form';
import FormInput from '@/components/shared/FormInput';
import { CardHeader,CardTitle,CardDescription } from '@/components/ui/card';

interface EmailStepProps {
  onVerified: () => void;
}

interface EmailFormData {
  email: string;
}

const EmailStep: React.FC<EmailStepProps> = ({ onVerified }) => {
  const { register, handleSubmit,formState: { errors }} = useForm<EmailFormData>();

  const onSubmit = (data: EmailFormData) => {
    console.log('Email submitted:', data);
    // TODO: send email to backend here
    onVerified();
  };


  return (
    <form  className="flex flex-col gap-5">
  
      <CardHeader className='p-0 pt-5'>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>Enter your registered email ID.</CardDescription>
      </CardHeader>

      <FormInput
        id="email"
        label="Email"
        name="email"
        type="email"
        placeholder="Registered Email ID"
        register={register}
        validationRule={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email',
          },
        }}
        error={errors.email}
      
      />

      <div className="flex justify-between mt-3">
        <button type="button" className="bg-gray-100 px-4 py-2 rounded-md">
          Back
        </button>
        <button onClick={handleSubmit(onSubmit)} type="button" className="bg-black text-white px-4 py-2 rounded-md">
          Verify
        </button>
      </div>
    </form>
  );
};

export default EmailStep;