const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const authMiddleware = require('../middelwares/authMiddelwares');
const checkRol = require('../middelwares/checkRolMiddleware');


router.get('/', authMiddleware, checkRol(['administrador', 'empleado']), usuariosController.obtenerUsuarios);
router.get('/:id/obras', authMiddleware, checkRol(['administrador', 'empleado']), usuariosController.obtenerObrasDeUsuario);
router.put('/:id', authMiddleware, checkRol(['administrador']), usuariosController.editarUsuario);
router.post('/registrar', authMiddleware, checkRol(['administrador']) , usuariosController.registrarUsuario);
router.delete('/:id', authMiddleware, checkRol(['administrador']), usuariosController.eliminarUsuario);


module.exports = router;
