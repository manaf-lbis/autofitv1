import { Router } from "express";
import { servicesController } from "../../di/mechnaicDI";


const router = Router();
 


router.post('/roadside-assistance/status',servicesController.roadsideStatusUpdate.bind(servicesController))
router.post('/roadside-assistance/quotation',servicesController.quotation.bind(servicesController))
router.get('/roadside-assistance/:id/details',servicesController.roadsideAssistanceDetails.bind(servicesController))
router.get('/service-history',servicesController.serviceHistory.bind(servicesController))


export default router