import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormInput from "@/components/shared/formInput/FormInput";
import SelectInput from "@/components/shared/selectInput/SelectInput";
import { useForm } from "react-hook-form";
import { useNewVehicleMutation, useUpdateVehicleMutation, useGetVehicleBrandQuery } from "../../../../../services/userServices/vehicleApi";
import { Vehicle } from "@/types/vehicle";
import { LoaderCircle } from "lucide-react";

type VehicleFormData = { regNo: string; brand: string; modelName: string; fuelType: string; owner: string };

const VehicleModal = ({ isOpen, setIsOpen, vehicle }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; vehicle: Vehicle | null; }) => {
  const [addVehicle, { isLoading: addingLoading }] = useNewVehicleMutation();
  const [updateVehicle, { isLoading: updatingLoading }] = useUpdateVehicleMutation();
  const { data, } = useGetVehicleBrandQuery({});
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
      if(vehicle){
        await updateVehicle({ ...data, id: vehicle._id } as any)
      }else{
        await addVehicle(data);
      }
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
      <DialogContent className="max-w-md w-[90%] sm:max-w-lg sm:w-full mx-auto rounded-xl border-0 shadow-xl p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Please fill in the vehicle details below.
          </DialogDescription>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-4 sm:px-6 pb-6 space-y-5 max-h-[65vh] overflow-y-auto">
          <div className="space-y-5">
            <FormInput 
              id="regNo" 
              label="Registration Number" 
              name="regNo" 
              placeholder="KL 00 AA 0000" 
              type="text" 
              register={register} 
              error={errors.regNo} 
              validationRule="regNo" 
            />
            
            <SelectInput 
              id="brand" 
              label="Vehicle Brand" 
              name="brand" 
              options={brands} 
              placeholder="Select Brand" 
              control={control} 
              error={errors.brand} 
            />
            
            <SelectInput 
              id="modelName" 
              label="Vehicle Model" 
              name="modelName" 
              options={models} 
              placeholder={selectedBrand ? "Select Model" : "First select brand"} 
              control={control} 
              error={errors.modelName} 
            />
            
            <SelectInput 
              id="fuel" 
              label="Fuel Type" 
              name="fuelType" 
              options={["Petrol", "Diesel"]} 
              placeholder="Select Fuel Type" 
              control={control} 
              error={errors.fuelType} 
            />
            
            <FormInput 
              id="owner" 
              label="Owner Name" 
              name="owner" 
              placeholder="Enter owner name" 
              type="text" 
              register={register} 
              error={errors.owner} 
              validationRule="name" 
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={onLoading}
              className="sm:w-auto px-8 py-2.5 rounded-lg border-gray-300 hover:bg-gray-50 font-medium"
            >
              Cancel
            </Button>
            <Button 
              disabled={onLoading}    
              className="sm:w-auto px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm flex items-center justify-center" 
              onClick={handleSubmit(onSubmit)} 
              type="submit"
            >
              {onLoading ? (
                <>
                  <LoaderCircle size={16} className="animate-spin mr-2" />
                  {vehicle ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                vehicle ? 'Update Vehicle' : 'Add Vehicle'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleModal;