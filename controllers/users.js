const User = require('../models/user');
const {
  ERROR_CODE,
  MESSAGE_ERROR_CODE,
  ERROR_NOT_FOUND,
  MESSAGE_ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  MESSAGE_ERROR_DEFAULT,
} = require('../utils/error');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })

    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send(MESSAGE_ERROR_CODE);
      } else {
        res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT);
      }
    });
};

const getUsers = (_req, res) => User.find({})
  .then((users) => res.send({ users }))
  .catch(() => res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT));

const getUser = (req, res) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return res.status(ERROR_NOT_FOUND).send(MESSAGE_ERROR_NOT_FOUND);
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE).send(MESSAGE_ERROR_CODE);
    } else {
      res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT);
    }
  });

const updateProfileInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send(MESSAGE_ERROR_NOT_FOUND);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send(MESSAGE_ERROR_CODE);
      } else {
        res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT);
      }
    });
};

const updateAvatar = (req, res) => {
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
        res.status(ERROR_CODE).send(MESSAGE_ERROR_CODE);
      } else {
        res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT);
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateAvatar,
  updateProfileInfo,
};
