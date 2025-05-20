import { Router } from "express";
import { VehicleController } from "../../controllers/user/vehicleController";
import { VehicleRepository } from "../../repositories/vehicleRepository";
import { VehicleService } from "../../services/vehicleService/vehicleService";
import { authenticate } from "../../middlewares/authenticate";
import { VehicleBrandRepository } from "../../repositories/vehicleBrandRepository";
import { authorize } from "../../middlewares/authorize";


const vehiclerepository  = new VehicleRepository()
const vehicleBrands = new VehicleBrandRepository()
const vehicleService = new VehicleService(vehiclerepository,vehicleBrands)
const vehicleController = new VehicleController(vehicleService);

const router = Router();

router.post('/new-vehicle',authenticate,authorize(['user']), (req, res,next) => vehicleController.addVehicle(req, res,next));
router.get('/my-vehicles',authenticate,authorize(['user']), (req, res,next) => vehicleController.getVehicles(req, res,next));
router.patch('/my-vehicle',authenticate,authorize(['user']), (req, res,next) => vehicleController.updateVehicle(req, res,next));
router.delete('/my-vehicle',authenticate,authorize(['user']), (req, res,next) => vehicleController.removeVehicle(req, res,next));

router.get('/vehicle-brands',authenticate,authorize(['user','admin']),(req,res,next)=> vehicleController.vehicleBrands(req,res,next))
router.post('/vehicle-brands',authenticate,authorize(['admin']),(req,res,next)=> vehicleController.addVehicleBrand(req,res,next))



export default router;
