const pool = require("../models/db");

// Registrar una nueva obra
exports.registrarObra = async (req, res) => {
  try {
    const { nombre, estado, fecha_inicio, fecha_fin, empleados } = req.body;

    if (!empleados || empleados.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Debes asignar al menos un empleado a la obra" });
    }

    const [obraExistente] = await pool.query(
      "SELECT * FROM obras WHERE nombre = ?",
      [nombre]
    );
    if (obraExistente.length > 0) {
      return res
        .status(400)
        .json({ mensaje: "Ya existe una obra con ese nombre" });
    }

    const [resultado] = await pool.query(
      "INSERT INTO obras (nombre, estado, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)",
      [nombre, estado, fecha_inicio, fecha_fin]
    );

    const obraId = resultado.insertId;

    for (const id_usuario of empleados) {
      await pool.query(
        "INSERT INTO empleado_obra (id_usuario, id_obra) VALUES (?, ?)",
        [id_usuario, obraId]
      );
    }

    res.status(201).json({ mensaje: "Obra registrada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar la obra" });
  }
};

// Obtener obras con su estado
exports.obtenerObras = async (req, res) => {
  try {
    const [obras] = await pool.query(
      "SELECT * FROM obras ORDER BY fecha_inicio DESC"
    );
    res.json(obras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las obras" });
  }
};
exports.editarObra = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, estado, fecha_inicio, fecha_fin, empleados } = req.body;

    const [obra] = await pool.query("SELECT * FROM obras WHERE id = ?", [id]);
    if (obra.length === 0) {
      return res.status(404).json({ mensaje: "Obra no encontrada" });
    }

    // Validación de fechas (opcional pero recomendable)
    const fechaInicio = fecha_inicio?.slice(0, 10);
    const fechaFin = fecha_fin?.slice(0, 10);

    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      return res
        .status(400)
        .json({
          mensaje: "La fecha de fin no puede ser anterior a la fecha de inicio",
        });
    }

    // Actualizar obra
    await pool.query(
      `UPDATE obras SET nombre = ?, estado = ?, fecha_inicio = ?, fecha_fin = ?
       WHERE id = ?`,
      [nombre, estado, fechaInicio, fechaFin, id]
    );

    // Actualizar empleados asignados (eliminar los anteriores y registrar los nuevos)
    await pool.query("DELETE FROM empleado_obra WHERE id_obra = ?", [id]);

    for (const id_usuario of empleados) {
      await pool.query(
        "INSERT INTO empleado_obra (id_usuario, id_obra) VALUES (?, ?)",
        [id_usuario, id]
      );
    }

    res.json({ mensaje: "Obra actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar la obra" });
  }
};

exports.eliminarObra = async (req, res) => {
  try {
    const { id } = req.params;

    const [obra] = await pool.query("SELECT * FROM obras WHERE id = ?", [id]);
    if (obra.length === 0) {
      return res.status(404).json({ mensaje: "Obra no encontrada" });
    }

    if (obra[0].estado === "finalizada") {
      return res
        .status(400)
        .json({ mensaje: "No se puede eliminar una obra finalizada" });
    }

    // Eliminar la obra
    await pool.query("DELETE FROM obras WHERE id = ?", [id]);

    res.json({ mensaje: "Obra eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar la obra" });
  }
};
