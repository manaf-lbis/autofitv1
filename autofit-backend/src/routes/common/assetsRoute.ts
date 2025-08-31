import Router from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../../types/role";
import { assetsController } from "../../di/commonDI";


const router = Router();



router.get('/protected', authenticate, authorize(Object.values(Role)), assetsController.getAsset.bind(assetsController));


export default router;