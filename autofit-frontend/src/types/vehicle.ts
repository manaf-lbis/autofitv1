export interface Vehicle {
  id: string;
  regNo: string;
  owner: string;
  brand:string
  modelName: string;
  image: string;
  fuelType: string;
}

export type VehicleFormData = {
  regNo: string;
  brand: string;
  modelName: string;
  fuelType: string;
  owner: string;
};