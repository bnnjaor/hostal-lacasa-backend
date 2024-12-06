import { deleteImage, uploadImage } from "../libs/cloudinary.js";
import Room from "../models/room.model.js";
import fs from "fs-extra";

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res.status(200).json(rooms);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

//funciones para administradores
export const createRoom = async (req, res) => {
  let { number, price, description } = req.body;

  number = parseInt(number, 10);
  price = parseFloat(price);

  try {
    const images = []; // Array para almacenar las imágenes subidas

    // Crea la instancia de la habitación sin imágenes aún
    const room = new Room({
      number,
      price,
      description,
      user: req.user.id,
      images, // Inicializa el campo `images` como un arreglo vacío
    });

    if (req.files?.image) {
      // Verifica si es un solo archivo o múltiples archivos
      const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];

      // Itera sobre cada archivo de imagen para subirlo y guardarlo
      for (const file of files) {
        const result = await uploadImage(file.tempFilePath);
        images.push({
          public_id: result.public_id,
          secure_url: result.url,
        });
        await fs.unlink(file.tempFilePath); // Elimina el archivo temporal después de subirlo
      }
      
      // Asigna el arreglo de imágenes subidas a la propiedad `images` de la habitación
      room.images = images;
    } else {
      // Imagen predeterminada en caso de que no se suban imágenes
      room.images = [
        {
          public_id: "replit/eehkbkjgvecl4yalwbc8",
          secure_url:
            "http://res.cloudinary.com/dg7k9yrjd/image/upload/v1730844990/replit/eehkbkjgvecl4yalwbc8.jpg",
        },
      ];
    }

    // Guarda la habitación con las imágenes en la base de datos
    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la habitación", error });
  }
};


export const updateRoom = async (req, res) => {
  try {
    const roomData = { ...req.body }; // Clona los datos de `req.body`

    // Encuentra la habitación existente
    const existingRoom = await Room.findById(req.params.id);
    if (!existingRoom) {
      return res
        .status(404)
        .json({ ok: false, message: "Habitación no encontrada" });
    }

    // Inicializa un arreglo para almacenar las nuevas imágenes
    const newImages = roomData.images || [];

    if (req.files?.image) {
      // Verifica si `req.files.image` es un arreglo (múltiples archivos) o un solo archivo
      const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];

      // Borra las imágenes existentes en Cloudinary si deseas reemplazarlas completamente
      if (existingRoom.images) {
        for (const image of existingRoom.images) {
          await deleteImage(image.public_id);
        }
      }

      // Sube cada nueva imagen y guárdala en `newImages`
      for (const file of files) {
        const result = await uploadImage(file.tempFilePath);
        newImages.push({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
        await fs.unlink(file.tempFilePath); // Elimina el archivo temporal localmente
      }
    } else {
      // Si no se subieron nuevas imágenes, conserva las imágenes existentes
      roomData.images = existingRoom.images;
    }

    // Actualiza el campo `images` de roomData con las nuevas imágenes
    roomData.images = newImages.length > 0 ? newImages : existingRoom.images;

    // Actualiza la habitación con los datos proporcionados
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, roomData, {
      new: true,
    });

    if (!updatedRoom) {
      return res
        .status(404)
        .json({ ok: false, message: "Error al actualizar la habitación" });
    }

    res.json({ ok: true, room: updatedRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error del servidor" });
  }
};


//getRoom osea obtener una sola habitacion seria para poder obtener la habitacion a actualizar o eliminar
export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("user");
    if (!room)
      return res
        .status(404)
        .json({ message: "la habitacion no fue encontrada" });
    res.status(200).json(room);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.images?.public_id) {
      await deleteImage(room.images.public_id);
    }

    return res.status(204).json({ message: "Room deleted" });
  } catch (error) {
    res.status(404).json({ message: "Room not found" + error });
  }
};
