import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, UseFormRegister, useFormContext } from "react-hook-form";
import { FileValidation } from "./FormValidation";

type FileType = "pdf" | "png" | "jpeg" | "jpg";

interface FormFileInputProps {
  id: string;
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  validationRule: keyof typeof FileValidation;
  accept: FileType[];
  onFileChange: (files: FileList | null) => void;
}

const mimeMap: Record<FileType, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
};

export default function FormFileInput({ id, label, name, register, error, validationRule, accept, onFileChange,
}: FormFileInputProps) {
  const acceptAttr = accept.map(ext => mimeMap[ext]).join(",");
  const [fileName, setFileName] = useState<string | null>(null);
  const { setValue, trigger } = useFormContext();

  const mimeChecker = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return true;
    return acceptAttr.split(",").includes(file.type)
      ? true
      : `Only ${accept.join(", ").toUpperCase()} files are allowed`;
  };

  const rules = {
    ...FileValidation[validationRule],
    validate: {
      ...FileValidation[validationRule].validate,
      mime: mimeChecker,
    },
  };

  const { onChange, ...rest } = register(name, rules);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await onChange(e);
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      onFileChange(files);
      setValue(name, files, { shouldValidate: true });
      await trigger(name);
    } else {
      setFileName(null);
      onFileChange(null);
      setValue(name, null, { shouldValidate: true });
      await trigger(name);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...rest}
        id={id}
        type="file"
        accept={acceptAttr}
        onChange={handleFileChange}
        className="
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-gray-100 file:text-gray-700
          hover:file:bg-gray-200 transition
        "
      />
      {fileName && (
        <p className="text-sm text-gray-600 mt-1">Selected: {fileName}</p>
      )}
      {error && (
        <div className="text-xs text-red-500 mt-1">
          {error.message || "Please upload a file"}
        </div>
      )}
    </div>
  );
}