const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');

const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const app = express();
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use((req, res, next) => {
  req.user = {
    _id: '639183a84a9e72bc360b5efd',
  };

  next();
});
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('*', (req, res) => res.status(404).json({ message: 'Страница не найдена' }));

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('Connected mongoDB');
  app.listen(PORT, () => {
    console.log(`App listening ${PORT}`);
  });
});
