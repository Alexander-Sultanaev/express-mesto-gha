const cardRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/(http|https):\/\/(www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+([0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]+)/),
  }),
}), createCard);
cardRoutes.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), deleteCard);
cardRoutes.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), likeCard);
cardRoutes.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), dislikeCard);

module.exports = cardRoutes;
