import { Router } from "express";
import { PretripController } from "./pretripController";
import { PretripService } from "../../services/pretripCheckup/pretripService";
import { PretripSlotRepository } from "../../repositories/pretripSlotRepository";
import { MechanicProfileRepository } from "../../repositories/mechanicProfileRepository";
import { GoogleMapRepository } from "../../repositories/GoogleMapRepository";


const router = Router();

const pretripSlotRepository = new PretripSlotRepository()
const mechanicProfileRepository = new MechanicProfileRepository()
const googleMapRepo = new GoogleMapRepository()
const pretripService = new PretripService(pretripSlotRepository,mechanicProfileRepository,googleMapRepo)
const pretripController = new PretripController(pretripService)
 
router.get('/slots',pretripController.getSlots.bind(pretripController));
router.post('/slots',pretripController.createSlots.bind(pretripController))
router.delete('/slots/:id',pretripController.removeSlot.bind(pretripController))


export default router


