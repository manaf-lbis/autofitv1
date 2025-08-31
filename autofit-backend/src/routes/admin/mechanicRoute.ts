import { Router } from "express";
import { mechanicController } from "../../di/adminDI";

const router = Router()


router.get("/applications", (req, res, next) => mechanicController.listApplications(req, res, next))
router.patch("/application/:id/status", (req, res, next) => mechanicController.applicationStatus(req, res, next))

router.get("/", (req, res, next) => mechanicController.getAllMechanic(req, res, next))
router.get("/:id", (req, res, next) => mechanicController.getMechanicById(req, res, next))
router.patch("/:id/status", (req, res, next) => mechanicController.changeStatus(req, res, next))



export default router
