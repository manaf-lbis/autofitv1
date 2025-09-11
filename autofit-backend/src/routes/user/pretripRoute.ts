import { Router } from "express";

import { authorize } from "../../middlewares/authorize";
import { authenticate } from "../../middlewares/authenticate";
import { pretripController } from "../../di/userDI";

const router = Router();





router.get('/plans',pretripController.getPlans.bind(pretripController));
router.get('/plan/:id',pretripController.getPlan.bind(pretripController));
router.get('/mechanic-shops',pretripController.getNearbyMechanics.bind(pretripController));
router.post('/booking',authenticate, authorize(['user']),pretripController.booking.bind(pretripController));
router.get('/:id/details',authenticate, authorize(['user']),pretripController.details.bind(pretripController));
router.post('/invoice',authenticate, authorize(['user']),pretripController.invoice.bind(pretripController));
router.post('/report',authenticate, authorize(['user']),pretripController.report.bind(pretripController));



export default router