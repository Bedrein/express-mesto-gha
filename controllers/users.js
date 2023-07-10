const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Ошибка валидации при создании пользователя',
        });
      } else {
        res.status(500).send({ message: 'Ошибка' });
      }
    });
};

const getUsers = (_req, res) => User.find({})
  .then((users) => res.status(200).send({ users }))
  .catch(() => res.status(500).send({ message: 'Ошибка по-умолчанию' }));

const getUser = (req, res) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    return res.status(200).send(user);
  })
  .catch(() => res.status(500).send({ message: 'Ошибка по-умолчанию' }));

const updateProfileInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.params.userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ massage: 'Пользователь не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные введены некоректно' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.params.userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные введены некоректно' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
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
