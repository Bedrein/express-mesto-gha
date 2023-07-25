// const jwt = require('jsonwebtoken');
// const AuthError = require('../utils/errors/authError');
// const { JWT_SECRET } = require('../utils/constants');

// const auth = (req, res, next) => {
//   const { token } = req.cookies;

//   try {
//     if (!token) {
//       next(new AuthError('Необходимо авторизоваться'));
//       return;
//     }

//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = payload;
//     next();
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = auth;

// const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../utils/constants');
// const AuthError = require('../utils/errors/authError');

// const handleAuthError = (req, res, next) => next(new AuthError('Необходима авторизация'));
// // eslint-disable-next-line consistent-return
// const auth = (req, res, next) => {
//   const { token } = req.cookies;
//   try {
//     if (!token) {
//       return handleAuthError(req, res, next);
//     }
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = payload;
//     next();
//   } catch (err) {
//     return handleAuthError(req, res, next);
//   }
// };

// module.exports = auth;

const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/authError');

const { JWT_SECRET } = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Необходимоj авторизоваться'));
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
