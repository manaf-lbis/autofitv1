import { Router } from "express";
import { servicesController } from "../../di/userDI";

const router = Router();

router.get('/mechanics-nearby', servicesController.getNearbyMechanic.bind(servicesController));
router.post('/roadside-assistance', servicesController.roadsideAssistance.bind(servicesController));
router.get('/roadside-assistance/:id/details', servicesController.serviceDetails.bind(servicesController));
router.post('/roadside-assistance/quotation/reject', servicesController.cancelQuotation.bind(servicesController));
router.post('/roadside-assistance/cancel', servicesController.cancelQuotation.bind(servicesController));
router.post('/roadside-assistance/invoice', servicesController.getInvoice.bind(servicesController));

export default router