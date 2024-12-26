import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
//creamos funcion para registar usuarios
export const register = async (req, res) => {
  //recibimos el email,password y username del formulario del frontend
  const { email, password, username } = req.body;

  //comprobamos si el email ya existe en la base de datos
  try {
    const userFound = await User.findOne({ email });

    //si el email existe, respondemos con un mensaje de error
    if (userFound) return res.status(400).json(["El correo ingresado ya esta registrado"]);

    //si el email no existe, creamos un nuevo usuario y lo guardamos en la base de datos

    //utilizamos la libreria bcryptjs para encriptar la contraseña
    const passwordHashs = await bcrypt.hash(password, 10);

    //creamos nuevo usuario y le asignamos los datos de la request
    const newUser = new User({
      username,
      email,
      password: passwordHashs,
    });

    //guardamos el nuevo usuario en la base de datos
    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token);
    res.json({
      message: "Usuario registrado con exito",
      id: userSaved._id,
      email: userSaved.email,
      username: userSaved.username,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
      isAdmin: userSaved.isAdmin
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: "hubo un error" + error });
  }
};

export const login = async (req, res) => {
  //recibimos el email,password y username de la request(solicitud)
  const { email, password } = req.body;

  //hacemos un trycatch por si llega haber un error
  try {
    //buscamos el usuario con su email en la bbdd
    const userFound = await User.findOne({ email });

    //si no se encuentra un usuario se retorna un status 400
    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    //utilizamos la libreria bcryptjs para comparar la contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);

    //si no coincide la contraseña se retorna un status 400
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    //guardamos el nuevo usuario en la base de datos
    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token);
    res.json({
      id: userFound._id,
      email: userFound.email,
      username: userFound.username,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
      isAdmin: userFound.isAdmin
    });
  } catch (error) {
    res.status(500).json({ message: "hubo un error" + error });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};


export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ok:false, message: "Unauthorized"})

  jwt.verify(token, process.env.JWT_SECRET_KEY, async(err, user)=>{
    if(err) return res.status(401).json({ok:false, message: 'Unauthorized'})

    const userFound = await User.findById(user.id)
    if(!user) return res.status(401).json({ok:false, message: 'Unauthorized'})

    return res.json({
      id: userFound._id,
      email: userFound.email,
      username: userFound.username,
      isAdmin: userFound.isAdmin
    })
  })
};