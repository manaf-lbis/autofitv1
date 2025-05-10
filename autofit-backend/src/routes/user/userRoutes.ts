import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import vehicleRoute from './vehicleRoute'
import profileRoute from './profileRoute'



const router = Router()


router.use('/vehicle',vehicleRoute)
router.use('/profile',profileRoute)


export default router