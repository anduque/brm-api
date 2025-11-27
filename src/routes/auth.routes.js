const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @api {post} /api/auth/register Registrar usuario
 * @apiName RegisterUser
 * @apiGroup Auth
 * @apiBody {String} username Nombre de usuario único.
 * @apiBody {String} name Nombre completo del usuario.
 * @apiBody {String} email Correo electrónico único.
 * @apiBody {String} password Contraseña en texto plano.
 *
 * @apiSuccess {String} message Mensaje de confirmación.
 * @apiSuccess {Object} data Datos del usuario (sin contraseña).
 *
 * @apiError (409) UsuarioExistente El nombre de usuario o correo ya existen.
 */
router.post('/register', authController.register);

/**
 * @api {post} /api/auth/login Iniciar sesión
 * @apiName LoginUser
 * @apiGroup Auth
 * @apiBody {String} username Nombre de usuario.
 * @apiBody {String} password Contraseña.
 *
 * @apiSuccess {String} message Mensaje de confirmación.
 * @apiSuccess {Object} data Datos del usuario autenticado.
 *
 * @apiError (404) UsuarioNoEncontrado El usuario no existe.
 * @apiError (401) CredencialesInvalidas La contraseña es incorrecta.
 */
router.post('/login', authController.login);

module.exports = router;


