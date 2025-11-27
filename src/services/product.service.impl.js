const { Product } = require('../models');
const HttpError = require('../exceptions/httpError');

const sanitizeProduct = (productInstance) =>
  productInstance.get({ plain: true });

const validateProductPayload = ({ lotNumber, name, price, stock }) => {
  if (!lotNumber || !name) {
    throw new HttpError(
      400,
      'Los campos número de lote y nombre son obligatorios'
    );
  }

  if (price === undefined || price === null || Number(price) <= 0) {
    throw new HttpError(400, 'El precio debe ser un número mayor a 0');
  }

  if (stock === undefined || stock === null || Number(stock) < 0) {
    throw new HttpError(400, 'El stock debe ser un número igual o mayor a 0');
  }
};

const createProduct = async (payload) => {
  validateProductPayload(payload);

  const product = await Product.create({
    lotNumber: payload.lotNumber,
    name: payload.name,
    price: payload.price,
    stock: payload.stock,
    entryDate: payload.entryDate || new Date(),
    isActive: true
  });

  return sanitizeProduct(product);
};

const listProducts = async ({ includeInactive } = {}) => {
  const where = {};
  if (!includeInactive) {
    where.isActive = true;
  }

  const products = await Product.findAll({
    where,
    order: [['createdAt', 'DESC']]
  });

  return products.map(sanitizeProduct);
};

const getProductByIdOrThrow = async (id) => {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new HttpError(404, 'Producto no encontrado');
  }
  return product;
};

const getProductById = async (id) => {
  const product = await getProductByIdOrThrow(id);
  return sanitizeProduct(product);
};

const updateProduct = async (id, payload) => {
  const product = await getProductByIdOrThrow(id);

  if (payload.lotNumber !== undefined) {
    if (!payload.lotNumber) {
      throw new HttpError(
        400,
        'El número de lote no puede estar vacío al actualizar'
      );
    }
    product.lotNumber = payload.lotNumber;
  }

  if (payload.name !== undefined) {
    if (!payload.name) {
      throw new HttpError(400, 'El nombre no puede estar vacío al actualizar');
    }
    product.name = payload.name;
  }

  if (payload.price !== undefined) {
    if (Number(payload.price) <= 0) {
      throw new HttpError(400, 'El precio debe ser mayor a 0');
    }
    product.price = payload.price;
  }

  if (payload.stock !== undefined) {
    if (Number(payload.stock) < 0) {
      throw new HttpError(400, 'El stock debe ser igual o mayor a 0');
    }
    product.stock = payload.stock;
  }

  if (payload.entryDate !== undefined) {
    product.entryDate = payload.entryDate;
  }

  await product.save();
  return sanitizeProduct(product);
};

const changeProductStatus = async (id, isActive) => {
  const product = await getProductByIdOrThrow(id);

  product.isActive = isActive;
  await product.save();

  return sanitizeProduct(product);
};

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  changeProductStatus
};


