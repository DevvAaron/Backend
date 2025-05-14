const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authMiddelware = require("../middelwares/authMiddelwares");
const checkRol = require("../middelwares/checkRolMiddleware");

router.get(
  "/movimientos-tipo",
  authMiddelware,
  checkRol(["administrador"]),
  dashboardController.movimientosPorTipo
);
router.get(
  "/movimientos-fecha",
  authMiddelware,
  checkRol(["administrador"]),
  dashboardController.movimientosPorFecha
);
router.get(
  "/productos-usados",
  authMiddelware,
  checkRol(["administrador"]),
  dashboardController.productosMasUsados
);
router.get(
  "/empleados-por-obra",
  authMiddelware,
  checkRol(["administrador"]),
  dashboardController.empleadosPorObra
);
router.get(
  "/stock-por-tipo",
  authMiddelware,
  checkRol(["administrador"]),
  dashboardController.stockPorTipoProducto
);
router.get(
  "/top-empleados-movimientos",
  authMiddelware,
  checkRol(["administrador"]),
  dashboardController.topEmpleadosPorMovimientos
);
router.get(
  "/movimientos-por-obra",
  authMiddelware,
  checkRol(["administrador"]),
  dashboardController.movimientosPorObra
);
router.get(
  "/productos-usados-por-tipo",
  authMiddelware,
  checkRol(["administrador"]),
  dashboardController.productosUsadosPorTipo
);
router.get(
  "/productos-stock-minimo",
  authMiddelware,
  checkRol(["administrador"]),
  dashboardController.productosConStockMinimo
);
router.get(
  "/valor-stock-producto",
  authMiddelware,
  checkRol(["administrador"]),
  dashboardController.valorTotalPorProducto
);

module.exports = router;
