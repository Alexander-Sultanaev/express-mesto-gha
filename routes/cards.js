const cardRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
      if (/^(http|https):\/\/\S+(?:jpg|jpeg|png)$/.test(value)) {
        return value;
      }
      return helpers.message('Передан некорректный URL-адрес');
    }),
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
