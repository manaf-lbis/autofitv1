import { Router } from "express";
import { vehicleController } from "../../di/userDI";
// import { VehicleController } from "../../controllers/user/vehicleController";
// import { VehicleRepository } from "../../repositories/vehicleRepository";
// import { VehicleService } from "../../services/vehicle/vehicleService";
// import { VehicleBrandRepository } from "../../repositories/vehicleBrandRepository";


// const vehiclerepository  = new VehicleRepository()
// const vehicleBrands = new VehicleBrandRepository()
// const vehicleService = new VehicleService(vehiclerepository,vehicleBrands)
// const vehicleController = new VehicleController(vehicleService);

const router = Router();

router.post('/new-vehicle', vehicleController.addVehicle.bind(vehicleController));
router.get('/my-vehicles', vehicleController.getVehicles.bind(vehicleController));
router.patch('/my-vehicle', vehicleController.updateVehicle.bind(vehicleController));
router.delete('/my-vehicle', vehicleController.removeVehicle.bind(vehicleController));
router.get('/vehicle-brands', vehicleController.vehicleBrands.bind(vehicleController));

export default router;
