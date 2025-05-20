import React from "react";
import FormInput from "@/components/shared/formInput/FormInput";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { nextStep, prevStep, updateFormData } from "../registrationSlice";
import { RootState } from "@/store/store";
import NextPreviewButton from "../components/NextPreviewButton";
import { steps } from "./stepsInfo";

interface FormData {
  education: string;
  specialised: string;
  experience: number;
}

const Step2: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { formData } = useSelector((state: RootState) => state.mechRegistration);
  const dispatch = useDispatch();

  const onSubmit = (data: FormData) => {
    dispatch(updateFormData(data));
    dispatch(nextStep());
  };

  const onPrev = () => dispatch(prevStep());

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="h-[400px] flex flex-col bg-white border rounded-md overflow-hidden">

        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-[#1c2b30] text-lg sm:text-xl">
            {steps[1].title}
          </h2>
          <p className="text-[#8e8e8e] text-xs sm:text-sm mt-1">
            {steps[1].description}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <FormInput
            id="education"
            label="Education"
            name="education"
            placeholder="eg. Bachelor of Science"
            register={register}
            type="text"
            validationRule="text"
            error={errors.education}
            defaultValue={formData?.education}
          />
          <FormInput
            id="specialised"
            label="Specialised On"
            name="specialised"
            placeholder="eg. A/C Mechanic"
            register={register}
            type="text"
            validationRule="text"
            error={errors.specialised}
            defaultValue={formData?.specialised}
          />
          <FormInput
            id="experience"
            label="Experience"
            name="experience"
            placeholder="Years of Experience"
            register={register}
            type="number"
            validationRule="text"
            error={errors.experience}
            defaultValue={formData?.experience}
          />
        </div>

        <div className="px-6 border-t">
          <NextPreviewButton onPrev={onPrev} onNext={handleSubmit(onSubmit)} />
        </div>

      </div>
    </form>
  );
};

export default Step2;