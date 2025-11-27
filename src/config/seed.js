const db = require('../models');

const seedRoles = async () => {
  try {
    const roles = [
      { id: 1, name: 'Administrador' },
      { id: 2, name: 'Cliente' }
    ];

    for (const role of roles) {
      await db.Role.findOrCreate({
        where: { id: role.id },
        defaults: role
      });
    }

    console.log('Roles inicializados correctamente.');
  } catch (error) {
    console.error('Error al inicializar roles:', error);
    throw error;
  }
};

const seed = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    await seedRoles();
    
    await db.sequelize.close();
    console.log('Seed completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error en el proceso de seed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seed();
}

module.exports = { seed, seedRoles };

