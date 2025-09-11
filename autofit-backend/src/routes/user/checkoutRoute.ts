import { Router } from "express";
import { checkoutcontroller } from "../../di/userDI";




const router = Router();





router.get('/:service_type/details/:id', checkoutcontroller.checkoutDetails.bind(checkoutcontroller));
router.post('/:service_type/payment/:id', checkoutcontroller.createPayment.bind(checkoutcontroller));
router.post('/:service_type/verify-payment/:id', checkoutcontroller.verifyPayment.bind(checkoutcontroller));


export default router