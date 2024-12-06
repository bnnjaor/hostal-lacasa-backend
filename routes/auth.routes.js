import { Router } from "express";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerShcema } from "../schemas/auth.schema.js";
import { login, logout, register, verifyToken } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validateSchema(registerShcema), register);
router.post("/login", validateSchema(loginSchema),login);
router.post('/logout', logout)
router.get('/verify', verifyToken)


export default router;
