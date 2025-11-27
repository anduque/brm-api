const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authorizeRoles } = require('../middlewares/auth.middleware');

/**
 * @api {post} /api/products Crear producto
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiHeader {String} Authorization Token Bearer
 */
router.post('/', authorizeRoles('Administrador'), productController.createProduct);

/**
 * @api {get} /api/products Listar productos
 * @apiName ListProducts
 * @apiGroup Products
 * @apiHeader {String} Authorization Token Bearer
 */
router.get('/', productController.listProducts);

/**
 * @api {get} /api/products/:id Obtener producto
 */
router.get('/:id', productController.getProduct);

/**
 * @api {put} /api/products/:id Actualizar producto
 */
router.put('/:id', authorizeRoles('Administrador'), productController.updateProduct);

/**
 * @api {patch} /api/products/:id/activate Activar producto
 */
router.patch('/:id/activate', authorizeRoles('Administrador'), productController.activateProduct);

/**
 * @api {patch} /api/products/:id/deactivate Desactivar producto
 */
router.patch('/:id/deactivate', authorizeRoles('Administrador'), productController.deactivateProduct);

module.exports = router;


