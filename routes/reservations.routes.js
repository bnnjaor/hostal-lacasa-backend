import { Router } from "express";
import { createReservation, getReservations } from "../controllers/reserv.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { reservationSchema } from "../schemas/reserv.schema.js";


const router = Router()

router.get('/', getReservations)
router.post("/",validateSchema(reservationSchema),createReservation)

export default router