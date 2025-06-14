import { Router } from "express";
import profileRoute from './profileRoutes'
import pagesRoute from './pagesRoute'

const router = Router()

router.use('/profile',profileRoute)
router.use('/pages',pagesRoute)


export default router
