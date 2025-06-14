import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { ServicesController } from "../../controllers/user/servicesController";
import { RoadsideAssistanceService } from "../../services/user/roadsideAssistanceService";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { GoogleMapRepository } from "../../repositories/GoogleMapRepository";
import { RoadsideAssistanceRepository } from "../../repositories/roadsideAssistanceRepo";
import { VehicleRepository } from "../../repositories/vehicleRepository";
import { NotificationRepository } from "../../repositories/notificationRepository";

const mechanicProfileRepo = new MechanicProfileRepository()
const googleMapRepo = new GoogleMapRepository()
const roadsideAssistanceRepo = new RoadsideAssistanceRepository()
const vehicleRepository = new VehicleRepository()
const notificationRepository = new NotificationRepository()
const roadsideAssistanceService = new RoadsideAssistanceService(mechanicProfileRepo,googleMapRepo,roadsideAssistanceRepo,vehicleRepository,notificationRepository)
const servicesController = new ServicesController(roadsideAssistanceService)


const router = Router();

router.get('/mechanic-near-me',authenticate, authorize(['user']),(req, res,next) => servicesController.getNearbyMechanic(req,res,next));
router.post('/roadside-assistance',authenticate, authorize(['user']),(req, res,next) => servicesController.roadsideAssistance(req,res,next));


export default router