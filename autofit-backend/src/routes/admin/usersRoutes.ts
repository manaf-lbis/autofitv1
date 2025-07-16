import { Router } from "express";
import { UserController } from "../../controllers/admin/userController";
import { UserServices } from "../../services/admin/userServices";
import { UserRepository } from "../../repositories/userRepository";
import { VehicleRepository } from "../../repositories/vehicleRepository";

const userRepository = new UserRepository()
const vehicleRepository = new VehicleRepository()
const userServices = new UserServices(userRepository, vehicleRepository)
const userController = new UserController(userServices)


const router = Router()

// router.get("/", (req, res, next) => userController.getAllUsers(req, res, next))
// router.get("/:id", (req, res, next) => userController.getUserById(req, res, next))
// router.patch("/:id/status", (req, res, next) => userController.changeStatus(req, res, next))

router.get("/", userController.getAllUsers.bind(userController))
router.get("/:id", userController.getUserById)
router.patch("/:id/status", userController.changeStatus.bind(userController))


export default router