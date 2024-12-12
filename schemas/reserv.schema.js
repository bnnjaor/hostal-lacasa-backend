import { z } from "zod";

export const reservationSchema = z.object({
    roomId: z.string(),
    startDate: z.coerce.date({
        required_error: "La fecha de inicio es requerida.",
    }),
    endDate: z.coerce.date({
        required_error: "La fecha de finalización es requerida.",
    }),
    clientName: z.string().nonempty("El nombre del cliente es requerido."),
}).refine((data) => data.endDate > data.startDate, {
    message: "La fecha de finalización debe ser posterior a la fecha de inicio.",
    path: ["endDate"], // Este es el campo donde ocurre el error
});
