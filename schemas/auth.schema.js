import { z } from "zod";

export const registerShcema = z.object({
  username: z
    .string({
      required_error: "El usuario es requerido",
    })
    .min(4)
    .max(20),
  email: z
    .string({
      required_error: "El email es requerido",
    })
    .email({
      message: "El email no es válido",
    }),
  password: z
    .string({
        required_error: "La contraseña es requerida",
    })
    .min(6, {
      message: "La contraseña debe tener minimo 8 caracteres",
    })
    .max(20),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "El email es requerido",
    })
    .email({
      message: "El email no es válido",
    }),
  password: z
    .string({
      required_error: "La contraseña es requerida",
    })
    .min(6),
});

