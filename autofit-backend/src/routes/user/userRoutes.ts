import { Router } from "express";
import vehicleRoute from './vehicleRoute'
import profileRoute from './profileRoute'
import servicesRoute from './servicesRoute'



const router = Router()


router.use('/vehicle',vehicleRoute)
router.use('/profile',profileRoute)
router.use('/services',servicesRoute)



export default router