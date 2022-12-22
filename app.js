/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { celebrate, errors, Joi } = require('celebrate');

const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

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
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', createUser);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);
app.use('*', (req, res) => res.status(404).json({ message: 'Страница не найдена' }));
app.use(errors());
mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('Connected mongoDB');
  app.listen(PORT, () => {
    console.log(`App listening ${PORT}`);
  });
});
