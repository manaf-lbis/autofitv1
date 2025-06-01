import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { nextStep, prevStep, updateFormData } from "../../../slices/registrationSlice";
import { RootState } from "@/store/store";
import LocationInput from "@/components/shared/LocationInput/LocationInput";
import FormInput from "@/components/shared/formInput/FormInput";
import NextPreviewButton from "../NextPreviewButton";
import { steps } from "../../../utils/RegistrationStepsInfo";

interface FormData {
  location: string;
  shopName: string;
  place: string;
  landmark: string;
}

const Step3: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();
  const { currentStep, formData } = useSelector((state: RootState) => state.mechRegistration);
  const dispatch = useDispatch();

  const onSubmit = (data: FormData) => {
    console.log(data);
    
    dispatch(updateFormData(data));
    dispatch(nextStep());
  };
  const onPrev = () => dispatch(prevStep());

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="h-[400px] flex flex-col bg-white border rounded-md overflow-hidden">
        
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-[#1c2b30] text-lg sm:text-xl">
            {steps[2].title}
          </h2>
          <p className="text-[#8e8e8e] text-xs sm:text-sm mt-1">
            {steps[2].description}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          <LocationInput
          id="location"
          label="Pick Your Location"
          name="location"
          register={register}
          error={errors.location}
          setValue={setValue}
          defaultValue={formData?.location}
          />
          <FormInput
            id="shopName"
            label="Name of Shop"
            name="shopName"
            placeholder="eg. My Shop"
            register={register}
            type="text"
            validationRule="text"
            error={errors.shopName}
            defaultValue={formData?.shopName}
          />
          <FormInput
            id="place"
            label="Place"
            name="place"
            placeholder="eg. Kollam"
            register={register}
            type="text"
            validationRule="text"
            error={errors.place}
            defaultValue={formData?.place}
          />
          <FormInput
            id="landmark"
            label="Landmark"
            name="landmark"
            placeholder="Near School"
            register={register}
            type="text"
            validationRule="text"
            error={errors.landmark}
            defaultValue={formData?.landmark}
          />
        </div>
        
        <div className="px-6  border-t">
          <NextPreviewButton onPrev={onPrev} onNext={handleSubmit(onSubmit)} />
        </div>
      </div>
    </form>
  );
};

export default Step3;
