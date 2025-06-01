import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { VehicleFormData } from "@/types/vehicle";

interface SelectInputProps {
  id: string;
  label: string;
  name: keyof VehicleFormData;
  options: string[];
  placeholder: string;
  control: any; 
  error?: any;
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  name,
  options,
  placeholder,
  control,
  error,
}) => (
  <div className="flex flex-col gap-1">
    <Label htmlFor={id}>{label}</Label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value || ""}>
          <SelectTrigger id={id}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option} className="hover:bg-slate-100 cursor-pointer">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {error && <span className="text-red-500 text-xs min-h-[0.875rem]">{error.message}</span>}
  </div>
);

export default SelectInput;
