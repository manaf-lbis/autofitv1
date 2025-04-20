import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import vehicleRoute from './user/vehicleRoute'
import profileRoute from './user/profileRoute'



const router = Router()


router.use('/vehicle',vehicleRoute)
router.use('/profile',profileRoute)


export default router