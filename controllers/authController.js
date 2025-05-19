const pool = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { dni, correo, password } = req.body;

    // Buscar por DNI o correo
    const [usuarios] = await pool.query(
      "SELECT * FROM usuarios WHERE dni = ? OR correo = ?",
      [dni || "", correo || ""]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = usuarios[0];

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        nombre: usuario.nombre,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // No devolver la contraseña
    delete usuario.password;

    res.json({
      mensaje: "Login exitoso",
      usuario,
      token,
    });
  } catch (error) {
    console.error("ERROR EN LOGIN:", error.message, error.stack);
    res
      .status(500)
      .json({ mensaje: "Error en el login", error: error.message });
  }
};
