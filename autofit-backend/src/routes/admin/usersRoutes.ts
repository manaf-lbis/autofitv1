import { Router } from "express";
import { UserController } from "../../controllers/admin/userController";
import { authorize } from "../../middlewares/authorize";
import { authenticate } from "../../middlewares/authenticate";
import { UserServices } from "../../services/admin/userServices";
import { UserRepository } from "../../repositories/userRepository";
import { VehicleRepository } from "../../repositories/vehicleRepository";

const userRepository = new UserRepository()
const vehicleRepository = new VehicleRepository()
const userServices = new UserServices(userRepository,vehicleRepository)
const userController = new UserController(userServices)


const router = Router()

router.get("/", authenticate, authorize(['admin']), (req,res,next)=>userController.getAllUsers(req,res,next))
router.get("/:id", authenticate, authorize(['admin']), (req,res,next)=>userController.getUserById(req,res,next))
router.patch("/:id/status", authenticate, authorize(['admin']), (req,res,next)=>userController.changeStatus(req,res,next))


export default router