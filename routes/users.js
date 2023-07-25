const router = require('express').Router();
const { validateUser, validateUserId, validateUserAvatar } = require('../utils/validate');

const {
  getUser,
  getUsers,
  updateProfileInfo,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateUser, updateProfileInfo);
router.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
