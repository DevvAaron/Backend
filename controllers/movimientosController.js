const pool = require('../models/db');

// Registrar movimiento
exports.registrarMovimiento = async (req, res) => {
  try {
    const {
      tipo,
      motivo,
      cantidad,
      observacion,
      id_producto,
      id_usuario,
      id_obra
    } = req.body;

    // ❌ Validar cantidad
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ mensaje: 'La cantidad debe ser mayor a 0' });
    }

    // ❌ Validar existencia de obra y que no esté finalizada
    const [obra] = await pool.query('SELECT * FROM obras WHERE id = ?', [id_obra]);
    if (obra.length === 0) {
      return res.status(404).json({ mensaje: 'Obra no encontrada' });
    }
    if (obra[0].estado === 'finalizada') {
      return res.status(400).json({ mensaje: 'No se pueden registrar movimientos en una obra finalizada' });
    }

    // ❌ Validar producto
    const [producto] = await pool.query('SELECT stock_actual FROM productos WHERE id = ?', [id_producto]);
    if (producto.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // ❌ Validar usuario
    const [usuario] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id_usuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // ❌ Validar stock si es salida
    if (tipo === 'salida' && producto[0].stock_actual < cantidad) {
      return res.status(400).json({ mensaje: 'Stock insuficiente para esta salida' });
    }

    // ✅ Registrar movimiento
    await pool.query(
      `INSERT INTO movimientos 
      (tipo, motivo, cantidad, observacion, id_producto, id_usuario, id_obra)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [tipo, motivo, cantidad, observacion, id_producto, id_usuario, id_obra]
    );

    // 🔄 Actualizar stock
    const signo = tipo === 'entrada' ? '+' : '-';
    await pool.query(
      `UPDATE productos SET stock_actual = stock_actual ${signo} ? WHERE id = ?`,
      [cantidad, id_producto]
    );

    res.status(201).json({ mensaje: 'Movimiento registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el movimiento' });
  }
};
// Obtener todos los movimientos
exports.obtenerMovimientos = async (req, res) => {
  try {
    const { tipo, id_obra, desde, hasta, id_usuario } = req.query;

    let query = `
      SELECT m.*, p.nombre AS producto, u.nombre AS usuario, o.nombre AS obra
      FROM movimientos m
      JOIN productos p ON m.id_producto = p.id
      JOIN usuarios u ON m.id_usuario = u.id
      JOIN obras o ON m.id_obra = o.id
      WHERE 1 = 1
    `;
    const values = [];

    if (tipo) {
      query += ' AND m.tipo = ?';
      values.push(tipo);
    }

    if (id_obra) {
      query += ' AND m.id_obra = ?';
      values.push(id_obra);
    }

    if (id_usuario) {
      query += ' AND m.id_usuario = ?';
      values.push(id_usuario);
    }

    if (desde && hasta) {
      query += ' AND DATE(m.fecha) BETWEEN ? AND ?';
      values.push(desde, hasta);
    }

    query += ' ORDER BY m.fecha DESC';

    const [result] = await pool.query(query, values);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener movimientos' });
  }
};

// Editar los movimientos solo motivo, cantidad y observación
exports.editarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo, cantidad, observacion } = req.body;

    const [movimientos] = await pool.query('SELECT * FROM movimientos WHERE id = ?', [id]);
    if (movimientos.length === 0) {
      return res.status(404).json({ mensaje: 'Movimiento no encontrado' });
    }

    await pool.query(
      `UPDATE movimientos 
       SET motivo = ?, cantidad = ?, observacion = ?
       WHERE id = ?`,
      [motivo, cantidad, observacion, id]
    );

    res.json({ mensaje: 'Movimiento actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el movimiento' });
  }
};


