const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InvoiceDetail = sequelize.define('InvoiceDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'invoices',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'invoice_details',
  timestamps: true,
  underscored: true
});

InvoiceDetail.associate = function(models) {
  InvoiceDetail.belongsTo(models.Invoice, {
    foreignKey: 'invoiceId',
    as: 'invoice'
  });
  InvoiceDetail.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  InvoiceDetail.belongsTo(models.Product, {
    foreignKey: 'productId',
    as: 'product'
  });
};

module.exports = InvoiceDetail;


