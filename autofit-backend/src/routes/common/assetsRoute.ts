import Router from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { AssetsController } from "../../controllers/common/assetsController";
import { AssetsService } from "../../services/assets/assetsService";
import { Role } from "../../types/role";


const router = Router();

const assetsService = new AssetsService();
const assetsController = new AssetsController(assetsService);

router.get('/protected', authenticate, authorize(Object.values(Role)), assetsController.getAsset.bind(assetsController));


export default router;