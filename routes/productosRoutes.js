const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productosController");
const authMiddleware = require('../middelwares/authMiddelwares');
const checkRol = require('../middelwares/checkRolMiddleware');


router.post('/registrar', authMiddleware, checkRol(['administrador', 'empleado']),productosController.registrarProducto);
router.get('/', authMiddleware, checkRol(['administrador', 'empleado']), productosController.obtenerProductos);
router.delete('/:id', authMiddleware, checkRol(['administrador']), productosController.eliminarProducto);
router.put('/:id', authMiddleware, checkRol(['administrador']),  productosController.editarProducto);

module.exports = router;
