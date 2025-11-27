const { sequelize } = require('../config/database');
const { Product, Invoice, InvoiceDetail } = require('../models');
const HttpError = require('../exceptions/httpError');

const sanitizeInvoice = (invoiceInstance) =>
  invoiceInstance.get({ plain: true });

const INVOICE_DETAILS_INCLUDE = [
  {
    model: InvoiceDetail,
    as: 'details',
    attributes: ['id', 'quantity', 'productId', 'createdAt', 'updatedAt'],
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'lotNumber', 'name', 'price']
      }
    ]
  }
];

const toNumber = (value) => Number(value);

const buildInvoiceDetailResponse = (invoice) => {
  const items = (invoice.details || []).map((detail) => {
    const unitPrice = toNumber(detail.product?.price ?? 0);
    const quantity = Number(detail.quantity);
    return {
      id: detail.id,
      productId: detail.productId,
      productName: detail.product?.name,
      lotNumber: detail.product?.lotNumber,
      quantity,
      unitPrice,
      lineTotal: Number((unitPrice * quantity).toFixed(2))
    };
  });

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    id: invoice.id,
    invoiceNumber: invoice.id,
    totalPrice: toNumber(invoice.totalPrice),
    totalItems,
    date: invoice.date,
    items
  };
};

const buildInvoiceSummary = (invoice) => {
  const details = invoice.details || [];
  const totalItems = details.reduce(
    (acc, detail) => acc + Number(detail.quantity),
    0
  );

  return {
    id: invoice.id,
    invoiceNumber: invoice.id,
    totalPrice: toNumber(invoice.totalPrice),
    totalItems,
    date: invoice.date
  };
};

const validateItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, 'Debe enviar al menos un producto para comprar');
  }

  items.forEach(({ productId, quantity }, index) => {
    if (!productId) {
      throw new HttpError(
        400,
        `El producto en la posición ${index + 1} no tiene productId`
      );
    }
    if (!quantity || Number(quantity) <= 0) {
      throw new HttpError(
        400,
        `La cantidad del producto ${productId} debe ser mayor a 0`
      );
    }
  });
};

const createPurchase = async ({ userId, items }) => {
  validateItems(items);

  let invoiceId;

  try {
    await sequelize.transaction(async (transaction) => {
      let totalPrice = 0;
      const detailsPayload = [];

      for (const item of items) {
        const product = await Product.findOne({
          where: { id: item.productId, isActive: true },
          transaction,
          lock: transaction.LOCK.UPDATE
        });

        if (!product) {
          throw new HttpError(
            404,
            `El producto ${item.productId} no está disponible`
          );
        }

        if (product.stock < item.quantity) {
          throw new HttpError(
            400,
            `Stock insuficiente para el producto ${product.name}`
          );
        }

        product.stock -= item.quantity;
        await product.save({ transaction });

        totalPrice += Number(product.price) * Number(item.quantity);
        detailsPayload.push({
          userId,
          productId: product.id,
          quantity: item.quantity
        });
      }

      const invoice = await Invoice.create(
        {
          clientId: userId,
          totalPrice,
          date: new Date()
        },
        { transaction }
      );

      invoiceId = invoice.id;

      await InvoiceDetail.bulkCreate(
        detailsPayload.map((detail) => ({
          ...detail,
          invoiceId: invoice.id
        })),
        { transaction }
      );
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'No fue posible procesar la compra');
  }

  const invoiceWithDetails = await Invoice.findByPk(invoiceId, {
    include: [
      {
        model: InvoiceDetail,
        as: 'details',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price']
          }
        ]
      }
    ]
  });

  return sanitizeInvoice(invoiceWithDetails);
};

const listPurchasesByUser = async ({ userId }) => {
  const invoices = await Invoice.findAll({
    where: { clientId: userId },
    include: INVOICE_DETAILS_INCLUDE,
    order: [['date', 'DESC']]
  });

  return invoices.map((invoiceInstance) => {
    const invoice = sanitizeInvoice(invoiceInstance);
    return buildInvoiceSummary(invoice);
  });
};

const getPurchaseDetail = async ({ userId, invoiceId }) => {
  const invoiceInstance = await Invoice.findOne({
    where: { id: invoiceId, clientId: userId },
    include: INVOICE_DETAILS_INCLUDE
  });

  if (!invoiceInstance) {
    throw new HttpError(404, 'Compra no encontrada');
  }

  const invoice = sanitizeInvoice(invoiceInstance);
  return buildInvoiceDetailResponse(invoice);
};

module.exports = {
  createPurchase,
  listPurchasesByUser,
  getPurchaseDetail
};


