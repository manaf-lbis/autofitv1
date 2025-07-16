import { Router} from "express";
import { AdminAuthController } from "../../controllers/admin/authController";
import { authenticate } from "../../middlewares/authenticate";
import { AdminAuthService } from "../../services/auth/admin/authService";
import { AdminRepository } from "../../repositories/adminRepository";
import { HashService } from "../../services/hash/hashService";
import { TokenService } from "../../services/token/tokenService";
import { AdminGoogleAuthService } from "../../services/auth/admin/googleAuthService";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../../types/role";



const adminRepository = new AdminRepository()
const hashService = new HashService()
const tokenService = new TokenService()

const adminAuthService = new AdminAuthService(adminRepository,hashService,tokenService)
const googleAuthService = new AdminGoogleAuthService(adminRepository,tokenService)
const authController = new AdminAuthController(adminAuthService,googleAuthService)


const router = Router()

router.post('/login', (req, res, next) => authController.login(req, res, next))
router.get('/me', authenticate,authorize([Role.ADMIN]), (req, res, next) => authController.getUser(req, res, next))
router.post('/google/callback', (req, res, next) => authController.googleCallback(req, res, next))
router.post('/logout',authenticate, authController.logout.bind(authController))

router.post("/refresh", (req, res, next) => authController.refreshToken(req, res, next));




export default router