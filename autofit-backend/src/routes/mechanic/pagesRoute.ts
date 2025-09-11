import { Router } from "express";
import { pageController } from "../../di/mechnaicDI";

const router = Router();

router.get('/dashboard', pageController.dashboard.bind(pageController));
router.get('/info', pageController.primaryInfo.bind(pageController));
router.get('/earnings',pageController.transactions.bind(pageController));



export default router