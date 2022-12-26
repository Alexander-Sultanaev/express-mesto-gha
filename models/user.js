const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: false,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    require: false,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    require: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => isURL(v),
      message: 'Неправильны формат ссылки!',
    },
  },
  email: {
    type: String,
    unique: true,
    require: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильны формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
