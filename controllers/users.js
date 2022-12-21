/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SUCCESS = 200;
const ERROR_NOT_FOUND = 404;
const ERROR_INCORRECT_DATE = 400;
const ERROR_INTERNAL_SERVER = 500;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).json(users);
  } catch (e) {
    console.error(e);
    if (e.message === 'NotValidId') {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователи не найдены' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).json(user);
  } catch (e) {
    console.error(e);
    if (e.message === 'NotValidId') {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователь не найден' });
    }
    if (e.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Некорректно передан _id пользователя' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(SUCCESS).json(user);
  } catch (e) {
    console.error(e);
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const updateInfoUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(userId, { name, about }, {
      new: true,
      runValidators: true,
    }).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).json(updateUser);
  } catch (e) {
    console.error(e);
    if (e.message === 'NotValidId') {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователь не найден' });
    }
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные при изменении данных' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const updateAvatarUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const updateUser = await User.findByIdAndUpdate(userId, { avatar }, {
      new: true,
      runValidators: true,
    }).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).json(updateUser);
  } catch (e) {
    console.error(e);
    if (e.message === 'NotValidId') {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователь не найден' });
    }
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные при изменении аватара' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (user === null) {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные email или пароля' });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные email или пароля' });
    }
    const payload = { _id: user._id, user: user.login };
    const tokenKey = 'token_key';
    const token = jwt.sign(payload, tokenKey, { expiresIn: '7d' });
    return res.status(SUCCESS).send({ token });
  } catch (e) {
    console.error(e);
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).send(user);
  } catch (e) {
    console.error(e);
    if (e.message === 'NotValidId') {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователи не найдены' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateInfoUser,
  updateAvatarUser,
  login,
  getUserInfo,
};
