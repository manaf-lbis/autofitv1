import { Router } from "express";
import { vehicleController } from "../../di/userDI";


const router = Router();

router.post('/new-vehicle', vehicleController.addVehicle.bind(vehicleController));
router.get('/my-vehicles', vehicleController.getVehicles.bind(vehicleController));
router.patch('/my-vehicle', vehicleController.updateVehicle.bind(vehicleController));
router.delete('/my-vehicle', vehicleController.removeVehicle.bind(vehicleController));
router.get('/vehicle-brands', vehicleController.vehicleBrands.bind(vehicleController));

export default router;
