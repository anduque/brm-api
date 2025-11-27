const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  underscored: true
});

Invoice.associate = function(models) {
  Invoice.belongsTo(models.User, {
    foreignKey: 'clientId',
    as: 'client'
  });
  Invoice.hasMany(models.InvoiceDetail, {
    foreignKey: 'invoiceId',
    as: 'details'
  });
};

module.exports = Invoice;


