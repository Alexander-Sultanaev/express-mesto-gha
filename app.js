const express = require('express');
const mongoose = require('mongoose');

const PORT = 3000;

const app = express();

mongoose.connect('mongodb://localhost:27021/mestodb', () => {
  console.log('Connected mongoDB');
});

app.listen(PORT, () => {
  console.log(`App listening ${PORT}`);
});
