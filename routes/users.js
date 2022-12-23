const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateInfoUser, updateAvatarUser, getUserInfo,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:me', getUserInfo);
userRoutes.get('/:userId', celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().required().length(24),
  }),
}), getUser);
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateInfoUser);
userRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/(http|https):\/\/(www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+([0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]+)/),
  }),
}), updateAvatarUser);
module.exports = userRoutes;
