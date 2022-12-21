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
    avatar: Joi.string().required().custom((value, helpers) => {
      if (/^(http|https):\/\/\S+(?:jpg|jpeg|png)$/.test(value)) {
        return value;
      }
      return helpers.message('Передан некорректный URL-адрес');
    }),
  }),
}), updateAvatarUser);

module.exports = userRoutes;
