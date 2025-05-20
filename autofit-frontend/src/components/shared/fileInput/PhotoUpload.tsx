import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { FieldError, UseFormRegister, useFormContext } from "react-hook-form";
import { FileValidation } from "./FormValidation";

interface Props {
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  validationRule: keyof typeof FileValidation;
  onFileChange: (files: FileList | null) => void;
}

export function PhotoUpload({ name, register, error, validationRule, onFileChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { setValue, trigger } = useFormContext();

  const validateMime = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return true;
    return (
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type) ||
      "Only JPG, JPEG, PNG files allowed"
    );
  };

  const rules = {
    ...FileValidation[validationRule],
    validate: {
      ...FileValidation[validationRule].validate,
      mime: validateMime,
    },
  };

  const { onChange, ...rest } = register(name, rules);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await onChange(e);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onloadend = async () => {
          setPreview(reader.result as string);
          onFileChange(files);
          setValue(name, files, { shouldValidate: true });
          await trigger(name);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
        setFileName(null);
        onFileChange(null);
        setValue(name, null, { shouldValidate: true });
        await trigger(name);
      }
    } else {
      setPreview(null);
      setFileName(null);
      onFileChange(null);
      setValue(name, null, { shouldValidate: true });
      await trigger(name);
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  return (
    <div className="space-y-3 w-full max-w-md">
      <Label className="text-sm font-medium text-gray-700">Photo</Label>

      {preview && (
        <div className="w-40 aspect-[4/5] overflow-hidden rounded-md border border-gray-200">
          <img src={preview} alt="Preview" className="object-cover w-full h-full" />
        </div>
      )}

      <div
        onClick={handleClick}
        className="flex items-center justify-between border border-dashed border-gray-300 hover:border-gray-500 transition cursor-pointer rounded-md p-3"
      >
        <div className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            {fileName || "Click to upload image"}
          </span>
        </div>
        <Button variant="outline" size="sm" type="button">
          Browse
        </Button>
      </div>

      <input
        {...rest}
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="text-xs text-red-500 mt-1">
          {error.message || "Please upload a file"}
        </div>
      )}
    </div>
  );
}