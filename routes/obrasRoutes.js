const express = require("express");
const router = express.Router();
const obrasController = require("../controllers/obrasController");
const authMiddleware = require("../middelwares/authMiddelwares");
const checkRol = require("../middelwares/checkRolMiddleware");

router.post(
  "/registrar",
  authMiddleware,
  checkRol(["administrador"]),
  obrasController.registrarObra
);
router.get(
  "/",
  authMiddleware,
  checkRol(["administrador", "empleado"]),
  obrasController.obtenerObras
);
router.put(
  "/:id",
  authMiddleware,
  checkRol(["administrador"]),
  obrasController.editarObra
);
router.delete(
  "/:id",
  authMiddleware,
  checkRol(["administrador"]),
  obrasController.eliminarObra
);

module.exports = router;
