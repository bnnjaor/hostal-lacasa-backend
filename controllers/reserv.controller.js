import Reservation from "../models/reserv.model.js";


export const getReservations = async (req, res) => {
    try {
      const reservations = await Reservation.find().populate('roomId', 'number');
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Crear una nueva reserva
export const createReservation = async (req, res) => {
    try {
        const { roomId, startDate, endDate, clientName } = req.body;

        // Validar solapamiento de fechas
        const overlappingReservation = await Reservation.findOne({
            roomId,
            $or: [
                {
                    startDate: { $lte: new Date(endDate) },
                    endDate: { $gte: new Date(startDate) }
                }
            ]
        });

        if (overlappingReservation) {
            return res.status(400).json({
                message: "La habitación ya está reservada en las fechas seleccionadas.",
            });
        }

        // Crear nueva reserva si no hay conflicto
        const reservation = new Reservation({
            roomId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            clientName,
        });

        await reservation.save();

        res.status(201).json({
            message: "Reserva creada con éxito.",
            reservation,
        });
    } catch (error) {
        res.status(500).json({
            error: "Ocurrió un error al crear la reserva.",
            details: error.message,
        });
    }
};

