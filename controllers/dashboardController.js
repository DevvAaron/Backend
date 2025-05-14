const pool = require('../models/db');

exports.movimientosPorTipo = async (req, res) => {
  try {
    const [data] = await pool.query(`
        SELECT tipo, COUNT(*) AS cantidad 
        FROM movimientos 
        GROUP BY tipo
      `);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener movimientos por tipo" });
  }
};
exports.empleadosPorObra = async (req, res) => {
  try {
    const [data] = await pool.query(`
        SELECT o.nombre AS obra, COUNT(eo.id_usuario) AS empleados_activos
        FROM obras o
        JOIN empleado_obra eo ON o.id = eo.id_obra
        GROUP BY o.id
      `);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener empleados por obra" });
  }
};
exports.productosMasUsados = async (req, res) => {
  try {
    const [data] = await pool.query(`
        SELECT p.nombre, SUM(m.cantidad) AS total_usado
        FROM movimientos m
        JOIN productos p ON m.id_producto = p.id
        WHERE m.tipo = 'salida'
        GROUP BY m.id_producto
        ORDER BY total_usado DESC
        LIMIT 5
      `);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener productos más usados" });
  }
};
exports.movimientosPorFecha = async (req, res) => {
  try {
    const [data] = await pool.query(`
        SELECT DATE(fecha) AS fecha, tipo, COUNT(*) AS cantidad
        FROM movimientos
        GROUP BY DATE(fecha), tipo
        ORDER BY fecha ASC
      `);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener movimientos por fecha" });
  }
};
//Stock actual por tipo de producto
exports.stockPorTipoProducto = async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT tipo, SUM(stock_actual) AS cantidad_total
      FROM productos
      GROUP BY tipo
    `);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el stock por tipo' });
  }
};
// Top empleados con más movimientos
exports.topEmpleadosPorMovimientos = async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT 
        u.nombre,
        SUM(CASE WHEN m.tipo = 'entrada' THEN 1 ELSE 0 END) AS entradas,
        SUM(CASE WHEN m.tipo = 'salida' THEN 1 ELSE 0 END) AS salidas
      FROM movimientos m
      JOIN usuarios u ON m.id_usuario = u.id
      GROUP BY m.id_usuario
      ORDER BY (entradas + salidas) DESC
      LIMIT 5;
    `);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener empleados con más movimientos' });
  }
};

// Cantidad de movimientos por obra
exports.movimientosPorObra = async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT 
        o.nombre AS obra,
        SUM(CASE WHEN m.tipo = 'entrada' THEN 1 ELSE 0 END) AS entradas,
        SUM(CASE WHEN m.tipo = 'salida' THEN 1 ELSE 0 END) AS salidas
      FROM movimientos m
      JOIN obras o ON m.id_obra = o.id
      GROUP BY o.id
      ORDER BY (entradas + salidas) DESC;
    `);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener movimientos por obra' });
  }
};

//Cantidad de productos utilizados por tipo
exports.productosUsadosPorTipo = async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT p.tipo, SUM(m.cantidad) AS total_usado
      FROM movimientos m
      JOIN productos p ON m.id_producto = p.id
      WHERE m.tipo = 'salida'
      GROUP BY p.tipo
    `);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener productos utilizados por tipo' });
  }
};
//Stock mínimo alcanzado (alerta)
exports.productosConStockMinimo = async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT nombre, stock_actual
      FROM productos
      WHERE stock_actual <= 3
      ORDER BY stock_actual ASC
    `);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener productos con stock bajo' });
  }
};
//Valor total en stock por producto
exports.valorTotalPorProducto = async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT nombre, ROUND(precio * stock_actual, 2) AS valor_total
      FROM productos
      ORDER BY valor_total DESC
      LIMIT 10
    `);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el valor total del stock por producto' });
  }
};


