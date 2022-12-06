const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');

const PORT = 3000;

const app = express();
app.use(express.json());
app.use('/users', userRoutes);
mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('Connected mongoDB');
});

app.listen(PORT, () => {
  console.log(`App listening ${PORT}`);
});
