import { Router } from "express";
import { CheckoutController } from "../../controllers/user/checkoutController";
import { CheckoutService } from "../../services/user/checkoutService";
import { PretripBookingRepository } from "../../repositories/pretripBookingRepository";
import { PaymentGatewayResolver } from "../../services/paymentServices/resolvers/paymentGatewayResolver";
import { RazorpayGateway } from "../../services/paymentServices/paymentGateways/razorpayGateway"; 
import { ServicePaymentHandleResolver } from "../../services/paymentServices/resolvers/servicePaymentHandleResolver";
import { PretripPaymentHandler } from "../../services/paymentServices/servicePaymentHandler/PretripPaymentHandler";
import { ServiceType } from "../../types/services";
import { PaymentGateway } from "../../types/payment";
import { PaymentRepository } from "../../repositories/PaymentRepository";
import { LiveAsistanceRepository } from "../../repositories/liveAssistanceRepository";
import { LiveAssistancePaymentHandler } from "../../services/paymentServices/servicePaymentHandler/liveAssistancePaymentHandler";
import { TimeBlockRepository } from "../../repositories/timeBlockRepository";



const router = Router();

const pretripBookingRepository = new PretripBookingRepository()
const razorpayGateway = new RazorpayGateway()
const paymentGatewayResolver = new PaymentGatewayResolver([{ name:PaymentGateway.RAZORPAY, instance: razorpayGateway }]);
const paymentRepository = new PaymentRepository()
const pretripPaymentHandler = new PretripPaymentHandler(pretripBookingRepository,paymentRepository);
const liveAssistanceRepo = new LiveAsistanceRepository()
const timeBlockingRepo = new TimeBlockRepository()
const liveAssistancePaymentHandler = new LiveAssistancePaymentHandler(liveAssistanceRepo,paymentRepository,timeBlockingRepo)
const servicePaymentHanleResolver = new ServicePaymentHandleResolver([
    {type:ServiceType.PRETRIP,handler:pretripPaymentHandler},
    {type:ServiceType.LIVE,handler:liveAssistancePaymentHandler}
]);
const checkoutService = new CheckoutService(pretripBookingRepository,paymentGatewayResolver,servicePaymentHanleResolver,paymentRepository,liveAssistanceRepo)
const checkoutcontroller = new CheckoutController(checkoutService)


router.get('/:service_type/details/:id', checkoutcontroller.checkoutDetails.bind(checkoutcontroller));
router.post('/:service_type/payment/:id', checkoutcontroller.createPayment.bind(checkoutcontroller));
router.post('/:service_type/verify-payment/:id', checkoutcontroller.verifyPayment.bind(checkoutcontroller));


export default router