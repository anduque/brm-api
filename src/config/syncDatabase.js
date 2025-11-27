const { sequelize } = require('./database');
const db = require('../models');
const { seedRoles } = require('./seed');

const syncDatabase = async (force = false, alter = false) => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    await sequelize.sync({ force, alter });
    
    if (force) {
      console.log('Base de datos sincronizada (modo force: tablas recreadas).');
    } else if (alter) {
      console.log('Base de datos sincronizada (modo alter: tablas modificadas).');
    } else {
      console.log('Base de datos sincronizada (modo normal).');
    }

    await seedRoles();
    
    process.exit(0);
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const alter = args.includes('--alter');
  
  syncDatabase(force, alter);
}

module.exports = syncDatabase;

