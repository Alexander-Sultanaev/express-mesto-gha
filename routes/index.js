const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const cardRoutes = require('./cards');
const userRoutes = require('./users');
const NotFoundError = require('../errors/NotFoundError');

const regexUrl = (/(http|https):\/\/(www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+([0-9a-zA-Z-._~:/?#[\]@!$&'()*+,;=]+)/);
routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regexUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
routes.use(auth);
routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);
routes.use('*', (req, res, next) => next(new NotFoundError('Ошибка 404. Страница не найдена')));

module.exports = routes;
