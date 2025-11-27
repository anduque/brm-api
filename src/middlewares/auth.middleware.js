const { verifyToken } = require('../utils/jwt');
const HttpError = require('../exceptions/httpError');
const { User, Role } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      throw new HttpError(401, 'Token de autenticación requerido');
    }

    const payload = verifyToken(token);
    const user = await User.findByPk(payload.id, {
      include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }]
    });

    if (!user) {
      throw new HttpError(401, 'Usuario no encontrado');
    }

    req.user = {
      id: user.id,
      username: user.username,
      roleId: user.roleId,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.status).json({ message: error.message });
    }

    const message =
      error.name === 'JsonWebTokenError' ? 'Token inválido' : 'No autorizado';
    return res.status(401).json({ message });
  }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const hasAccess = allowedRoles.includes(req.user.role?.name);
  if (!hasAccess) {
    return res.status(403).json({ message: 'No tiene permisos para esta acción' });
  }

  next();
};

module.exports = {
  authenticate,
  authorizeRoles
};


