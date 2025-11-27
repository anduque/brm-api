const authServiceImpl = require('./auth.service.impl');

module.exports = {
  register: authServiceImpl.register,
  login: authServiceImpl.login
};


