const Card = require('../models/card');

const createCard = (req, res) => {
  const {
    name, link,
  } = req.body;

  const owner = req.user._id;
  console.log(name);
  console.log(link);
  console.log(owner);

  Card.create({
    name,
    link,
    owner,
  })

    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({

          message: 'Ошибка, некорректные данные при создании карточки',
        });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

const getCards = (_req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send({ cards });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по-умолчанию' }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ massage: 'Карточка не найдена' });
      }
      res.status(200).send(card);
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по-умолчанию' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные преданны неверно' });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: 'Идентификатор некорректен' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Данные переданны неверно' });
      } else if (err.name === 'CastError') {
        res.status(404).send({ message: 'Идентификатор некорректен' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
