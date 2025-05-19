const pool = require("../models/db");
const bcrypt = require("bcryptjs");

exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, dni, telefono, correo, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existe] = await pool.query("SELECT * FROM usuarios WHERE dni = ?", [
      dni,
    ]);
    if (existe.length > 0)
      return res.status(400).json({ mensaje: "DNI ya registrado" });

    await pool.query(
      "INSERT INTO usuarios (nombre, dni, telefono, correo, password, rol) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, dni, telefono, correo, hashedPassword, rol]
    );

    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};
exports.editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, dni, telefono, correo, password } = req.body;

    // Validación de usuario existente
    const [usuarios] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);
    if (usuarios.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Validación de DNI duplicado (si cambió)
    const [dniExiste] = await pool.query(
      "SELECT id FROM usuarios WHERE dni = ? AND id != ?",
      [dni, id]
    );
    if (dniExiste.length > 0) {
      return res
        .status(400)
        .json({ mensaje: "DNI ya está en uso por otro usuario" });
    }

    // Encriptar nueva contraseña si se envía
    let hashedPassword = usuarios[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Actualizar datos
    await pool.query(
      `UPDATE usuarios 
       SET nombre = ?, dni = ?, telefono = ?, correo = ?, password = ?
       WHERE id = ?`,
      [nombre, dni, telefono, correo, hashedPassword, id]
    );

    res.json({ mensaje: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar el usuario" });
  }
};
exports.obtenerUsuarios = async (req, res) => {
  try {
    const { rol } = req.query;

    let query = 'SELECT id, nombre, dni, telefono, correo, rol, fecha_registro FROM usuarios';
    const valores = [];

    if (rol) {
      query += ' WHERE rol = ?';
      valores.push(rol);
    }

    const [usuarios] = await pool.query(query, valores);
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};
exports.obtenerObrasDeUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [obras] = await pool.query(`
      SELECT o.id, o.nombre, o.estado, o.fecha_inicio, o.fecha_fin
      FROM obras o
      JOIN empleado_obra eo ON o.id = eo.id_obra
      WHERE eo.id_usuario = ?
    `, [id]);

    res.json(obras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las obras del usuario' });
  }
};
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [usuario] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    if (usuario.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el usuario" });
  }
};
