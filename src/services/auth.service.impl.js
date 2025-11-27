const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');
const HttpError = require('../exceptions/httpError');
const { signToken } = require('../utils/jwt');

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
const DEFAULT_CLIENT_ROLE_ID = Number(process.env.DEFAULT_CLIENT_ROLE_ID || 2);

const sanitizeUser = (userInstance) => {
  const user = userInstance.get({ plain: true });
  delete user.password;
  return user;
};

const register = async ({ username, name, email, password }) => {
  if (!username || !name || !email || !password) {
    throw new HttpError(400, 'Los campos usuario, nombre, correo y contraseña son obligatorios');
  }

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    throw new HttpError(409, 'El nombre de usuario ya existe');
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new HttpError(409, 'El correo electrónico ya existe');
  }

  const defaultRole = await Role.findByPk(DEFAULT_CLIENT_ROLE_ID);
  if (!defaultRole) {
    throw new HttpError(500, 'El rol predeterminado no está configurado');
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = await User.create({
    username,
    name,
    email,
    password: hashedPassword,
    roleId: defaultRole.id
  });

  return sanitizeUser(user);
};

const login = async ({ username, password }) => {
  if (!username || !password) {
    throw new HttpError(400, 'Los campos usuario y contraseña son obligatorios');
  }

  const user = await User.findOne({
    where: { username },
    include: [
      {
        model: Role,
        as: 'role',
        attributes: ['id', 'name']
      }
    ]
  });

  if (!user) {
    throw new HttpError(404, 'Usuario no encontrado');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new HttpError(401, 'Credenciales inválidas');
  }

  const sanitizedUser = sanitizeUser(user);
  const token = signToken({
    id: sanitizedUser.id,
    username: sanitizedUser.username,
    roleId: sanitizedUser.roleId
  });

  return { user: sanitizedUser, token };
};

module.exports = {
  register,
  login
};


