import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from 'react-hook-form';
import { FormValidation, Rule } from './FormValidation';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder: string;
  error?: FieldError;
  register: any;
  name: string;
  validationRule: keyof Rule;
  defaultValue?: string | number;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type,
  placeholder,
  error,
  register,
  name,
  validationRule,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative flex flex-col gap-1 transition-all duration-300 ease-in-out">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        <Input
          {...register(name, FormValidation[validationRule])}
          id={id}
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder}
          className={`${isPassword ? 'pr-10' : ''}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-opacity duration-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>


      <div
        className={`min-h-[0.875rem] transition-all duration-300 ease-in-out ${
          error ? 'opacity-100 mt-1' : 'opacity-0 h-0'
        }`}
      >
        <span className="text-xs text-red-500 block">{error?.message}</span>
      </div>
    </div>
  );
};

export default FormInput;