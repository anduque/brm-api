const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['email']
    }
  ]
});

User.associate = function(models) {
  User.belongsTo(models.Role, {
    foreignKey: 'roleId',
    as: 'role'
  });
  User.hasMany(models.Invoice, {
    foreignKey: 'clientId',
    as: 'invoices'
  });
  User.hasMany(models.InvoiceDetail, {
    foreignKey: 'userId',
    as: 'invoiceDetails'
  });
};

module.exports = User;

