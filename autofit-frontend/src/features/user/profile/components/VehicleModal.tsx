import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Vehicle } from "./VehicleCard";
import FormInput from "@/components/shared/FormInput";
import { useForm } from "react-hook-form";
import SelectInput from "@/components/shared/SelectInput";

type FormData = {
  regNo: string;
  brand: string;
  model: string;
  fuelType: string;
  owner: string;
};

const VehicleModal = ({ isOpen, setIsOpen, vehicle }: { isOpen: boolean; setIsOpen: any; vehicle: Vehicle | null }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();

  const onValidSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
          <DialogDescription>
            Please fill in the vehicle details below.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <FormInput  id="regNo"  label="Registration No" name="regNo"  placeholder="KL 00 AA 0000" register={register} 
             error={errors.regNo}  type="text" validationRule="regNo"  />
            
            <SelectInput  id="brand" label="Select Brand"  name="brand" options={['vehicle br1', 'vehicle 2']} placeholder="Vehicle Brand"
              register={register} setValue={setValue} validationRule="brand" error={errors.brand} />
            
            <SelectInput id="model" label="Select Vehicle" name="model" options={['vehicle 1', 'vehicle 2']}
              placeholder="Vehicle Model" register={register} setValue={setValue} validationRule="model" error={errors.model} />
            
            <SelectInput id="fuel" label="Fuel Type" name="fuelType" options={['Petrol', 'Diesel']} placeholder="Fuel Type"
              register={register} setValue={setValue} validationRule="fuelType" error={errors.fuelType} />
            
            <FormInput id="owner" label="Owner Name" name="owner" placeholder="eg: John" register={register} error={errors.owner}
              type="text" validationRule="name" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit(onValidSubmit)} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleModal;