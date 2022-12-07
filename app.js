const express = require('express');
const mongoose = require('mongoose');
const cardRoutes = require('./routes/cards');

const userRoutes = require('./routes/users');

const PORT = 3000;

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63902563dbc728ae970c2839',
  };

  next();
});
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('Connected mongoDB');
  app.listen(PORT, () => {
    console.log(`App listening ${PORT}`);
  });
});
