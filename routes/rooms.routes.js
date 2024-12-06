import { Router } from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoom,
  updateRoom,
} from "../controllers/rooms.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { roomCreateSchema } from "../schemas/room.schema.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get("/", getAllRooms);
router.get("/:id", getRoom);
router.post(
  "/",
  authRequired,
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  validateSchema(roomCreateSchema),
  createRoom
);
router.delete("/:id", authRequired, deleteRoom);
router.put(
  "/:id",
  authRequired,
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  updateRoom
);

export default router;
