const userRoutes = require('express').Router();
const {
  getUsers, getUser, updateInfoUser, updateAvatarUser,
} = require('../controllers/users');

userRoutes.get('/', getUsers);

userRoutes.get('/:userId', getUser);
userRoutes.patch('/me', updateInfoUser);
userRoutes.patch('/me/avatar', updateAvatarUser);

module.exports = userRoutes;
