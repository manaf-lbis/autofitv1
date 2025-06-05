import React, { useEffect } from "react";
import FormInput from "@/components/shared/formInput/FormInput";
import { useForm } from "react-hook-form";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { nextStep, prevStep, updateFormData } from "../../../slices/registrationSlice";
import NextPreviewButton from "../NextPreviewButton";
import { steps } from "../../../utils/RegistrationStepsInfo";

interface FormData {
  name: string;
  email: string;
  mobile: string;
}

const Step1: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: FormData) => {
    dispatch(updateFormData(data));
    dispatch(nextStep());
  };

  const onPrev = () => dispatch(prevStep());

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="h-[440px] flex flex-col bg-white border rounded-md overflow-hidden">

        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-[#1c2b30] text-lg sm:text-xl">
            {steps[0].title}
          </h2>
          <p className="text-[#8e8e8e] text-xs sm:text-sm mt-1">
            {steps[0].description}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <FormInput
            id="name"
            label="Name"
            name="name"
            placeholder="Your Name"
            register={register}
            type="text"
            validationRule="name"
            error={errors.name}
            disabled={true}
          />
          <FormInput
            id="email"
            label="Email"
            name="email"
            placeholder="Email"
            register={register}
            type="email"
            validationRule="email"
            error={errors.email}
            disabled={true}
          />
          <FormInput
            id="mobile"
            label="Phone"
            name="mobile"
            placeholder="Mobile Number"
            register={register}
            type="tel"
            validationRule="mobile"
            error={errors.mobile}
            disabled={true}
          />
        </div>

        <div className="px-6 border-t">
          <NextPreviewButton onPrev={onPrev} onNext={handleSubmit(onSubmit)} />
        </div>
      </div>
    </form>
  );
};

export default Step1;
