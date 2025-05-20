import { Router } from "express";
import profileRoute from './profileRoutes'

const router = Router()

router.use('/profile',profileRoute)


export default router
