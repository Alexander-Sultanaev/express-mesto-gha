const userRoutes = require('express').Router();
const {
  getUsers, getUser, createUser, updateInfoUser, updateAvatarUser,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:userId', getUser);
userRoutes.post('/', createUser);
userRoutes.patch('/me', updateInfoUser);
userRoutes.patch('/me/avatar', updateAvatarUser);

module.exports = userRoutes;
