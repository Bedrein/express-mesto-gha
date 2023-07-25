const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/NotFoundError');
const AuthError = require('../utils/errors/authError');
const BadRequestError = require('../utils/errors/badRequestError');
const NouniqueError = require('../utils/errors/NouniqueError');
const { JWT_SECRET } = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(String(password), 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))

    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      if (err.code === 11000) {
        next(new NouniqueError('При регистрации указан email, который уже существует'));
        return;
      }
      next(err);
    });
};

const getUsers = (_req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

const getUser = (req, res, next) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }
    next(res.send(user));
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  });

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

function updateProfileInfo(req, res, next) {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new AuthError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new AuthError('Неправильные почта или пароль'));
          }

          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          res.send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateAvatar,
  updateProfileInfo,
  login,
  getUserInfo,
};
