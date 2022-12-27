const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const ForbiddenError = require('../errors/ForbiddenError');

const SUCCESS = 200;

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(SUCCESS).json(cards);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(SUCCESS).json(card);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return next(new IncorrectDataError('Ошибка 400. Переданы некорректные данные при создании карточки'));
    }
    return next(err);
  }
};
const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card.findById(cardId).populate('owner').orFail(new Error('NotValidId'));
    const ownerId = card.owner._id.toString();
    if (ownerId !== userId) {
      return next(new ForbiddenError('Ошибка 403. Недостаточно прав.'));
    }
    await Card.findByIdAndRemove(cardId);
    return res.status(SUCCESS).json({ message: 'Карточка успешно удалена' });
  } catch (err) {
    console.error(err);
    if (err.message === 'NotValidId') {
      return next(new NotFoundError('Ошибка 404. Карточка не найдена'));
    }
    if (err.name === 'CastError') {
      return next(new IncorrectDataError('Ошибка 400. Переданы некорректный _id удаляемой карточки'));
    }
    return next(err);
  }
};
const likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (card === null) {
      return next(new NotFoundError('Ошибка 404. Карточка не найдена'));
    }
    await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return res.status(SUCCESS).json({ message: 'Лайк успешно отправлен' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new IncorrectDataError('Ошибка 400. Переданы некорректный данные для поставки лайка'));
    }
    return next(err);
  }
};
const dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (card === null) {
      return next(new NotFoundError('Ошибка 404. Карточка не найдена'));
    }
    await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.status(SUCCESS).json({ message: 'Лайк успешно удален' });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
