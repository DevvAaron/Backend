const express = require('express');
const router = express.Router();
const movimientosController = require('../controllers/movimientosController');
const authMiddelware = require('../middelwares/authMiddelwares');
const checkRol = require('../middelwares/checkRolMiddleware');


router.post('/registrar',  authMiddelware, checkRol(['administrador', 'empleado']),movimientosController.registrarMovimiento);
router.get('/', authMiddelware,checkRol(['administrador', 'empleado']),movimientosController.obtenerMovimientos);
router.put('/:id', authMiddelware, checkRol(['administrador']), movimientosController.editarMovimiento);

module.exports = router;
