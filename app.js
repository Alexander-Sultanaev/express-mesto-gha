/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { checkAuth } = require('./middlewares/auth');

const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();
app.use(express.json());
app.use(limiter);
app.use(helmet());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Передан некорректный e-mail пользователя');
    }),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (/^(http|https):\/\/[^ "]+$/.test(value)) {
        return value;
      }
      return helpers.message('Передан некорректный URL-адрес аватара пользователя');
    }),
  }),
}), createUser);

app.use('/users', checkAuth, userRoutes);
app.use('/cards', checkAuth, cardRoutes);
app.use('*', (req, res) => res.status(404).json({ message: 'Страница не найдена' }));

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('Connected mongoDB');
  app.listen(PORT, () => {
    console.log(`App listening ${PORT}`);
  });
});
