const Card = require('../models/card');

const SUCCESS = 200;
const ERROR_NOT_FOUND = 404;
const ERROR_INCORRECT_DATE = 400;
const ERROR_INTERNAL_SERVER = 500;

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(SUCCESS).json(cards);
  } catch (e) {
    console.error(e);
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(SUCCESS).json(card);
  } catch (e) {
    console.error(e);
    if (e.name === 'ValidationError' || e.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    await Card.findByIdAndRemove(cardId).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).json({ message: 'Карточка успешно удалена' });
  } catch (e) {
    console.error(e);
    if (e.message === 'NotValidId') {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Карточка не найдена' });
    }
    if (e.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректный _id удаляемой карточки' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).json({ message: 'Лайк успешно отправлен' });
  } catch (e) {
    console.error(e);
    if (e.message === 'NotValidId') {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Карточка не найдена' });
    }
    if (e.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректный данные для поставки лайка' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};
const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(new Error('NotValidId'));
    return res.status(SUCCESS).json({ message: 'Лайк успешно удален' });
  } catch (e) {
    console.error(e);
    if (e.message === 'NotValidId') {
      return res.status(ERROR_NOT_FOUND).json({ message: 'Карточка не найдена' });
    }
    if (e.name === 'CastError') {
      return res.status(ERROR_INCORRECT_DATE).json({ message: 'Переданы некорректный данные для удаления лайка' });
    }
    return res.status(ERROR_INTERNAL_SERVER).json({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
