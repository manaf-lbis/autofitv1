import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../../types/role";
import { authenticate } from "../../middlewares/authenticate";
import { authController } from "../../di/adminDI";


const router = Router()

router.post('/login', (req, res, next) => authController.login(req, res, next))
router.get('/me', authenticate, authorize([Role.ADMIN]), (req, res, next) => authController.getUser(req, res, next))
router.post('/google/callback', (req, res, next) => authController.googleCallback(req, res, next))
router.post('/logout', authenticate, authController.logout.bind(authController))

router.post("/refresh", (req, res, next) => authController.refreshToken(req, res, next));




export default router