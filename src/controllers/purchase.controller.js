const purchaseService = require('../services/purchase.service');

const createPurchase = async (req, res, next) => {
  try {
    const invoice = await purchaseService.createPurchase({
      userId: req.user.id,
      items: req.body.items
    });

    res.status(201).json({
      message: 'Compra registrada correctamente',
      data: invoice
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return next(error);
  }
};

const listPurchases = async (req, res, next) => {
  try {
    const purchases = await purchaseService.listPurchasesByUser({
      userId: req.user.id
    });

    res.json({
      message: 'Listado de compras obtenido correctamente',
      data: purchases
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return next(error);
  }
};

const getPurchaseById = async (req, res, next) => {
  try {
    const invoice = await purchaseService.getPurchaseDetail({
      userId: req.user.id,
      invoiceId: req.params.id
    });

    res.json({
      message: 'Detalle de compra obtenido correctamente',
      data: invoice
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    return next(error);
  }
};

module.exports = {
  createPurchase,
  listPurchases,
  getPurchaseById
};


