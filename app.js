/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

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

app.post('/signin', login);
app.post('/signup', createUser);

app.use(checkAuth);
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('*', (req, res) => res.status(404).json({ message: 'Страница не найдена' }));

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('Connected mongoDB');
  app.listen(PORT, () => {
    console.log(`App listening ${PORT}`);
  });
});
