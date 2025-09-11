import { Router } from "express";
import { pagesController } from "../../di/adminDI";

const router = Router()


router.get("/dashboard", pagesController.dashboard.bind(pagesController));




export default router
