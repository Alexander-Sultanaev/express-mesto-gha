/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const SUCCESS = 200;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(SUCCESS).json(users);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).json(user);
  } catch (err) {
    console.error(err);
    if (err.message === 'NotValidId') {
      return next(new NotFoundError('Ошибка 404. Пользователь не найден'));
    }
    if (err.name === 'CastError') {
      return next(new IncorrectDataError('Ошибка 400. Некорректно передан _id пользователя'));
    }
    return next(err);
  }
};
const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(SUCCESS).json({
      _id: user._id, email: user.email, name: user.name, about: user.about, avatar: user.avatar,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return next(new ConflictError('Ошибка 409. Пользователь c такой почтой уже существует'));
    }
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new IncorrectDataError('Ошибка 400. Переданы некорректные данные при создании пользователя'));
    }
    return next(err);
  }
};
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(userId, { name, about }, {
      new: true,
      runValidators: true,
    }).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).json(updateUser);
  } catch (err) {
    console.error(err);
    if (err.message === 'NotValidId') {
      return next(new NotFoundError('Ошибка 404.Пользователь не найден'));
    }
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new IncorrectDataError('Ошибка 400. Переданы некорректные данные при изменении данных'));
    }
    return next(err);
  }
};
const updateAvatarUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const updateUser = await User.findByIdAndUpdate(userId, { avatar }, {
      new: true,
      runValidators: true,
    }).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).json(updateUser);
  } catch (err) {
    console.error(err);
    if (err.message === 'NotValidId') {
      return next(new NotFoundError('Ошибка 404.Пользователь не найден'));
    }
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new IncorrectDataError('Ошибка 400. Переданы некорректные данные при изменении аватара'));
    }
    return next(err);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (user === null) {
      return next(new UnauthorizedError('Ошибка 401. Переданы некорректные данные email или пароля'));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new UnauthorizedError('Ошибка 401. Переданы некорректные данные email или пароля'));
    }
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    return res.status(SUCCESS).json({ token });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
const getUserInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).send(user);
  } catch (err) {
    console.error(err);
    if (err.message === 'NotValidId') {
      return next(new NotFoundError('Ошибка 404.Пользователь не найден'));
    }
    return next(err);
  }
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserProfile,
  updateAvatarUser,
  login,
  getUserInfo,
};
