const pool = require("../models/db");

exports.registrarProducto = async (req, res) => {
  try {
    const { nombre, tipo, descripcion, precio, stock_actual } = req.body;
    const [existe] = await pool.query(
      "SELECT * FROM productos WHERE nombre = ? AND tipo = ?",
      [nombre, tipo]
    );
    if (existe.length > 0)
      return res.status(400).json({ mensaje: "Producto ya registrado" });

    await pool.query(
      "INSERT INTO productos (nombre, tipo, descripcion, precio, stock_actual) VALUES (?, ?, ?, ?, ?)",
      [nombre, tipo, descripcion, precio, stock_actual]
    );
    res.status(201).json({ mensaje: "Producto registrado exitosamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const [productos] = await pool.query(`
      SELECT *, (precio * stock_actual) AS total 
      FROM productos
      ORDER BY total DESC
    `);
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const [existe] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await pool.query('DELETE FROM productos WHERE id = ?', [id]);

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
};

exports.editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, descripcion, precio, stock_actual } = req.body;

    const [existe] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await pool.query(
      `UPDATE productos 
       SET nombre = ?, tipo = ?, descripcion = ?, precio = ?, stock_actual = ? 
       WHERE id = ?`,
      [nombre, tipo, descripcion, precio, stock_actual, id]
    );

    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el producto' });
  }
};

