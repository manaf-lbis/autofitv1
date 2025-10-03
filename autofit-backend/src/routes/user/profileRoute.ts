import { Router } from "express";
import { profileController } from "../../di/userDI";



const router = Router();

router.patch('/update', profileController.updateUser.bind(profileController));
router.get('/service-history/roadside-assistance', profileController.roadsideServiceHistory.bind(profileController));
router.get('/service-history/pretrip', profileController.pretripServiceHistory.bind(profileController));
router.get('/service-history/live-assistance', profileController.liveAssistanceServiceHistory.bind(profileController));
router.post('/review', profileController.addReview.bind(profileController));
router.get('/reviews', profileController.listReviews.bind(profileController));





export default router