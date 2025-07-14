import Router from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { AssetsController } from "../../controllers/common/assetsController";
import { AssetsService } from "../../services/assets/assetsService";


const router = Router();

const assetsService = new AssetsService();
const assetsController = new AssetsController(assetsService);

router.get('/protected', authenticate, authorize(['admin', 'mechanic', 'user']), assetsController.getAsset.bind(assetsController));


export default router;