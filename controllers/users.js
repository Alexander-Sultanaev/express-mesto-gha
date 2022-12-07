const User = require('../models/user');

const SUCCESS = 200;
const ERROR_NOT_FOUND = 404;
const ERROR_INCORRECT_DATE = 400;
const ERROR_INTERNAL_SERVER = 500;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователи не найдены' });
    }
    return res.status(SUCCESS).json(users);
  } catch (e) {
    console.error(e);
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Пользователь не найден' });
    }
    return res.status(SUCCESS).json(user);
  } catch (e) {
    console.error(e);
    if (e.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Некорректно передан _id пользователя' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    await User.create({ name, about, avatar });
    return res.status(SUCCESS).json({ name, about, avatar });
  } catch (e) {
    console.error(e);
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
