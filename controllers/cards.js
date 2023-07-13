const Card = require('../models/card');
const {
  ERROR_CODE,
  MESSAGE_ERROR_CODE,
  ERROR_NOT_FOUND,
  MESSAGE_ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  MESSAGE_ERROR_DEFAULT,
} = require('../utils/error');

const createCard = (req, res) => {
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
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send(MESSAGE_ERROR_CODE);
      } else {
        res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT);
      }
    });
};

const getCards = (_req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ cards });
    })
    .catch(() => res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send(MESSAGE_ERROR_NOT_FOUND);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send(MESSAGE_ERROR_CODE);
        return;
      }
      res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT);
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send(MESSAGE_ERROR_NOT_FOUND);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send(MESSAGE_ERROR_CODE);
        return;
      }
      res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT);
    });
};
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send(MESSAGE_ERROR_NOT_FOUND);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send(MESSAGE_ERROR_CODE);
        return;
      }
      res.status(ERROR_DEFAULT).send(MESSAGE_ERROR_DEFAULT);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
