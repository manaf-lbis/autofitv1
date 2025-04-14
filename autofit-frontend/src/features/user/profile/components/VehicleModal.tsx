import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Vehicle } from "./VehicleCard"
import FormInput from "@/components/shared/FormInput"
import { useForm } from "react-hook-form"

type FormData = {
    regNo:string;
    brand:string;
    model:string;
    fuelType:string;
    owner:string
}



const VehicleModal = ({isOpen,setIsOpen,vehicle}:{isOpen:boolean,setIsOpen:any,vehicle:Vehicle|null}) => {

    const {register,handleSubmit,formState:{errors}} = useForm<FormData>()

    

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>

      <DialogContent className="w-600">
        <DialogHeader>
          <DialogTitle>
            {
                vehicle ? 'Edit Vehicle' : 'Add New Vehicle'
            }
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
      
            <FormInput  id="regNo" label="Registration No"  name="regno" placeholder="KL 00 AA 0000" register={register} error={errors.regNo} type="text" validationRule="regNo"  />
        
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default VehicleModal