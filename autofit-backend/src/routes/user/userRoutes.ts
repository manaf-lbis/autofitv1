import { Router } from "express";
import vehicleRoute from './vehicleRoute'
import profileRoute from './profileRoute'
import servicesRoute from './servicesRoute'
import pretripRoute from './pretripRoute'
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";



const router = Router()


router.use('/vehicle', authenticate, authorize(['user']), vehicleRoute)
router.use('/profile', authenticate, authorize(['user']), profileRoute)
router.use('/services',authenticate, authorize(['user']), servicesRoute)
router.use('/pretrip', pretripRoute)



export default router