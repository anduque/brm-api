const productServiceImpl = require('./product.service.impl');

module.exports = {
  createProduct: productServiceImpl.createProduct,
  listProducts: productServiceImpl.listProducts,
  getProductById: productServiceImpl.getProductById,
  updateProduct: productServiceImpl.updateProduct,
  changeProductStatus: productServiceImpl.changeProductStatus
};


