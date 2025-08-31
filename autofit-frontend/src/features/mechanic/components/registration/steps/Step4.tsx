import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { prevStep,setCurrentStep,setLoading,stopLoading } from "../../../slices/registrationSlice";
import NextPreviewButton from "../NextPreviewButton";
import { steps } from "../../../utils/RegistrationStepsInfo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/store/store";
import { useRegisterMechanicMutation } from "../../../../../services/mechanicServices/mechanicApi";



interface FormData {
  photo: FileList;
  qualification: FileList;
  shopImage: FileList;
}

const Step4: React.FC = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors },} = useForm<FormData>();
  const { formData } = useSelector((state: RootState) => state.mechRegistration);
  const [mechRegistration,] = useRegisterMechanicMutation()

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoFile = watch("photo")?.[0];

  useEffect(() => {
    if (photoFile && canvasRef.current) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext("2d")!;
          canvas.width = 200;
          canvas.height = 250;
          ctx.clearRect(0, 0, 200, 250);
          ctx.drawImage(img, 0, 0, 200, 250);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(photoFile);
    }
  }, [photoFile]);

  const onSubmit = async (data: FormData) => {
    const form = new FormData();

    if (data.photo && data.photo.length > 0) {
      form.append("photo", data.photo[0]);
    }

    if (data.qualification && data.qualification.length > 0) {
      form.append("qualification", data.qualification[0]);
    }

    if (data.shopImage && data.shopImage.length > 0) {
      form.append("shopImage", data.shopImage[0]);
    }

    if (formData) {
      for (const key in formData) {
        form.append(key, String(formData[key as keyof typeof formData]));
      }
    }

    try {
      dispatch(setLoading())
      await mechRegistration(form)
      dispatch(stopLoading())
      dispatch(setCurrentStep(4))
      location.href = '/admin/dashboard'

    } catch (error) {
      dispatch(stopLoading())
      console.log(error);
    }
  };

  const onPrev = () => dispatch(prevStep());

  return (
    <form>
      <div className="h-[440px] flex flex-col bg-white border rounded-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-[#1c2b30] text-lg sm:text-xl">
            {steps[3].title}
          </h2>
          <p className="text-[#8e8e8e] text-xs sm:text-sm mt-1">
            {steps[3].description}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Photo Upload */}
          <div className="grid w-full items-start gap-1.5">
            <Label htmlFor="photo">
              Photo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              {...register("photo", { required: "Photo is required" })}
            />
            {errors.photo && (
              <span className="text-sm text-red-500">
                {errors.photo.message}
              </span>
            )}

            {photoFile && (
              <div className="mt-2">
                <canvas ref={canvasRef} className="border" />
              </div>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              accept="application/pdf"
              type="file"
              {...register("qualification", {
                required: "Qualification Required",
              })}
            />
            {errors.qualification && (
              <span className="text-sm text-red-500">
                {errors.qualification?.message}
              </span>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="shopImage">Shop Image</Label>
            <Input
              id="shopImage"
              accept="image/*"
              type="file"
              {...register("shopImage", { required: "Shop Image Required" })}
            />
            {errors.shopImage && (
              <span className="text-sm text-red-500">
                {errors.shopImage.message}
              </span>
            )}
          </div>
        </div>

        <div className="px-6 border-t">
          <NextPreviewButton onPrev={onPrev} onNext={handleSubmit(onSubmit)} />
        </div>
      </div>
    </form>
  );
};

export default Step4;
