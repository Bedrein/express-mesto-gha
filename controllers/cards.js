const Card = require('../models/card');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/badRequestError');
const ForbbiddenError = require('../utils/errors/forbbiddenError');

const createCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;

  const owner = req.user._id;
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
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ cards });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      if (req.user._id !== card.owner.toString()) {
        next(new ForbbiddenError('У пользователя нет доступа к удалению карточки'));
        return;
      }
      card.deleteOne()
        .then(() => res.send(card))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
