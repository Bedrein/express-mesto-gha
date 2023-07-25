const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/authError');

const { JWT_SECRET } = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Необходимо авторизоваться'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthError('Необходимо авторизоваться'));
    return;
  }

  req.user = payload;
  next();
};
module.exports = auth;
