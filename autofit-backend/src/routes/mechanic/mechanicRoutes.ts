import { Router } from "express";
import profileRoute from './profileRoutes'
import pagesRoute from './pagesRoute'
import serviceRoute from './serviceRoute'
import { authorize } from "../../middlewares/authorize";
import { authenticate } from "../../middlewares/authenticate";

const router = Router()

router.use('/profile', authenticate, authorize(['mechanic']), profileRoute)
router.use('/pages', authenticate, authorize(['mechanic']), pagesRoute)
router.use('/services',authenticate, authorize(['mechanic']), serviceRoute)


export default router
