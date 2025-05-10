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
    <div className="relative flex flex-col gap-1">
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

      <span className="text-red-500 text-xs min-h-[0.875rem] transition-all duration-300">
        {error?.message ?? ''}
      </span>
    </div>
  );
};

export default FormInput;