import jwt from "jsonwebtoken";
import env from "dotenv";
env.config()

export const createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    },
    (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};
