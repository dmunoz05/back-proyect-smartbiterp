import getConnection from "../database/connection.sqlserver.js";
import { variablesDB } from "../utils/params/const.database.js";
import { variablesJWT } from "../utils/params/const.jwt.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = variablesJWT.jwt_secret;

export const sesionUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const conn =  await getConnection();
    const db = variablesDB.name_db;
    const result = await conn
      .request()
      .input("username", username)
      .input("password", password)
      .query(`SELECT UsuarioID, Username, Contrasena FROM ${db}.Usuario WHERE Username = @username AND Contrasena = @password`);


    if (result.recordset.length === 0) {
      return res.status(200).json({ message: "Usuario no encontrado" });
    }

    const user = result.recordset[0];

    if (user.Contrasena !== password) {
      return res.status(200).json({ message: "Contraseña incorrecta" });
    }

    // Generar token
    const token = jwt.sign(
      { usuarioID: user.UsuarioID, username : user.Username  },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({ token, usuario: { id: user.UsuarioID, username: user.Username } });
  } catch (err) {
    res.status(500).json({ message: "Error interno", error: err.message });
  }
};

export const validateToken = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, variablesJWT.jwt_secret);
    return res.status(200).json({ message: "Token válido", user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
