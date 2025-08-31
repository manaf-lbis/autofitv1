import { Router } from "express";
import usersRoute from './usersRoutes'
import mechanicRoute from './mechanicRoute'
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import pretripPlansRoute from "./pretripPlansRoute"


const router = Router();

router.use('/users', authenticate, authorize(['admin']), usersRoute)
router.use('/mechanic', authenticate, authorize(['admin']), mechanicRoute)
router.use('/plans', authenticate, authorize(['admin']), pretripPlansRoute)


export default router