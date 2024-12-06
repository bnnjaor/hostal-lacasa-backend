import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token)
    return res
      .status(401)
      .json({ ok: false, message: "No token , Autorizacion requerida" });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(err).json({ ok: false, message: "Token Invalido" });

    req.user = user;

    next();
  });
};
