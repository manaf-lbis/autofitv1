import { Router } from "express";
import { userController } from "../../di/adminDI";


const router = Router()

router.get("/", userController.getAllUsers.bind(userController))
router.get("/:id", userController.getUserById.bind(userController))
router.patch("/:id/status", userController.changeStatus.bind(userController))


export default router