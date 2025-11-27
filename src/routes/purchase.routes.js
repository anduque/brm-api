const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase.controller');
const { authorizeRoles } = require('../middlewares/auth.middleware');

/**
 * @api {get} /api/purchases Historial de compras
 * @apiName ListPurchases
 * @apiGroup Purchases
 * @apiHeader {String} Authorization Token Bearer
 */
router.get('/', authorizeRoles('Cliente'), purchaseController.listPurchases);

/**
 * @api {get} /api/purchases/:id Detalle de compra
 * @apiName GetPurchase
 * @apiGroup Purchases
 * @apiHeader {String} Authorization Token Bearer
 */
router.get('/:id', authorizeRoles('Cliente'), purchaseController.getPurchaseById);

/**
 * @api {post} /api/purchases Registrar compra
 * @apiName CreatePurchase
 * @apiGroup Purchases
 * @apiHeader {String} Authorization Token Bearer
 */
router.post('/', authorizeRoles('Cliente'), purchaseController.createPurchase);

module.exports = router;


