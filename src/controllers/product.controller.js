const productService = require('../services/product.service');

const handleServiceError = (error, res, next) => {
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }
  return next(error);
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ message: 'Producto creado correctamente', data: product });
  } catch (error) {
    handleServiceError(error, res, next);
  }
};

const listProducts = async (req, res, next) => {
  try {
    const includeInactive =
      req.query.includeInactive === 'true' &&
      req.user?.role?.name === 'Administrador';
    const products = await productService.listProducts({ includeInactive });
    res.json({ data: products });
  } catch (error) {
    handleServiceError(error, res, next);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ data: product });
  } catch (error) {
    handleServiceError(error, res, next);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ message: 'Producto actualizado correctamente', data: product });
  } catch (error) {
    handleServiceError(error, res, next);
  }
};

const activateProduct = async (req, res, next) => {
  try {
    const product = await productService.changeProductStatus(req.params.id, true);
    res.json({ message: 'Producto activado correctamente', data: product });
  } catch (error) {
    handleServiceError(error, res, next);
  }
};

const deactivateProduct = async (req, res, next) => {
  try {
    const product = await productService.changeProductStatus(req.params.id, false);
    res.json({ message: 'Producto desactivado correctamente', data: product });
  } catch (error) {
    handleServiceError(error, res, next);
  }
};

module.exports = {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  activateProduct,
  deactivateProduct
};


