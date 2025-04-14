import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { FieldError } from 'react-hook-form';
import { FormValidation, Rule } from './SelectValidation';

interface SelectInputProps {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  options: string[];
  error?: FieldError;
  register: any;
  setValue: any; 
  validationRule: keyof Rule;
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  name,
  placeholder,
  options,
  error,
  register,
  setValue,
  validationRule
}) => {
  React.useEffect(() => {
    register(name, FormValidation[validationRule]);
  }, [name, register, validationRule]);

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={(value) => setValue(name, value)} defaultValue="">
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-red-500 text-xs min-h-[0.875rem] transition-all duration-300">
        {error?.message ?? ''}
      </span>
    </div>
  );
};

export default SelectInput;