import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormInput from "@/components/shared/formInput/FormInput";
import SelectInput from "@/components/shared/SelectInput";
import { useForm } from "react-hook-form";
import { useNewVehicleMutation, useUpdateVehicleMutation, useGetVehicleBrandQuery } from "../../../api/vehicleApi";
import { Vehicle } from "@/types/vehicle";
import { LoaderCircle } from "lucide-react";

type VehicleFormData = { regNo: string; brand: string; modelName: string; fuelType: string; owner: string };

const VehicleModal = ({ isOpen, setIsOpen, vehicle, refetchVehicles }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; vehicle: Vehicle | null; refetchVehicles: () => void }) => {
  const [addVehicle, { isLoading: addingLoading }] = useNewVehicleMutation();
  const [updateVehicle, { isLoading: updatingLoading }] = useUpdateVehicleMutation();
  const { data, isError, isLoading } = useGetVehicleBrandQuery({});
  const { register, handleSubmit, formState: { errors }, reset, setValue, trigger, watch, control } = useForm<VehicleFormData>({
    defaultValues: { regNo: "", brand: "", modelName: "", fuelType: "", owner: "" },
  });

  const selectedBrand = watch("brand");
  const brands = data?.data?.map((item: any) => item.brand) || [];
  const models = selectedBrand ? data?.data?.find((item: any) => item.brand === selectedBrand)?.models || [] : [];
  const prevBrand = React.useRef("");
  const onLoading = addingLoading || updatingLoading

  useEffect(() => {
    if (prevBrand.current && prevBrand.current !== selectedBrand) setValue("modelName", "");
    prevBrand.current = selectedBrand;
  }, [selectedBrand, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset(vehicle ? {
        regNo: vehicle.regNo,
        brand: vehicle.brand,
        modelName: vehicle.modelName,
        fuelType: vehicle.fuelType,
        owner: vehicle.owner
      } : {
        regNo: "",
        brand: "",
        modelName: "",
        fuelType: "",
        owner: ""
      });
      trigger();
    }
  }, [vehicle, isOpen, reset, trigger]);

  const onSubmit = async (data: VehicleFormData) => {
    try {
      
      vehicle ? await updateVehicle({ ...data, id: vehicle._id } as any) : await addVehicle(data);
      await refetchVehicles();
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
          <DialogDescription>Please fill in the vehicle details below.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput id="regNo" label="Registration No" name="regNo" placeholder="KL 00 AA 0000" type="text" register={register} error={errors.regNo} validationRule="regNo" />
          <SelectInput id="brand" label="Select Brand" name="brand" options={brands} placeholder="Vehicle Brand" control={control} error={errors.brand} />
          <SelectInput id="modelName" label="Select Vehicle" name="modelName" options={models} placeholder="Vehicle Model" control={control} error={errors.modelName} />
          <SelectInput  id="fuel" label="Fuel Type" name="fuelType" options={["Petrol", "Diesel"]} placeholder="Fuel Type" control={control} error={errors.fuelType} />
          <FormInput  id="owner" label="Owner Name" name="owner" placeholder="eg: John" type="text" register={register} error={errors.owner} validationRule="name" />
        </div>
        <DialogFooter>
          <Button disabled={onLoading}    className="w-[150px] h-[40px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg flex items-center justify-center" onClick={handleSubmit(onSubmit)} type="submit">
           { onLoading ? <LoaderCircle size={24} className="animate-spin "  /> :'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleModal;
