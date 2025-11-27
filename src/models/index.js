const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

const db = {};

// Leer todos los archivos de modelos en el directorio actual
const modelsPath = __dirname;
const modelFiles = fs.readdirSync(modelsPath).filter(file => {
  return file !== 'index.js' && file.endsWith('.js');
});

// Importar todos los modelos
modelFiles.forEach(file => {
  const model = require(path.join(modelsPath, file));
  const modelName = file.replace('.js', '');
  db[modelName] = model;
});

// Inicializar asociaciones si existen
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = require('sequelize');

module.exports = db;

