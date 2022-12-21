const userRoutes = require('express').Router();
const {
  getUsers, getUser, updateInfoUser, updateAvatarUser, getUserInfo,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:userId', getUser);
userRoutes.get('/:me', getUserInfo);
userRoutes.patch('/me', updateInfoUser);
userRoutes.patch('/me/avatar', updateAvatarUser);

module.exports = userRoutes;
