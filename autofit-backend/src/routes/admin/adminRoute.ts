import { Router} from "express";
import usersRoute from './usersRoutes'
import mechanicRoute from './mechanicRoute'


const router = Router();

router.use('/users',usersRoute)
router.use('/mechanic',mechanicRoute)





export default router