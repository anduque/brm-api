const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: true,
  underscored: true
});

Role.associate = function(models) {
  Role.hasMany(models.User, {
    foreignKey: 'roleId',
    as: 'users'
  });
};

module.exports = Role;

