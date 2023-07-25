const router = require('express').Router();
const { validateUserAuth, validateUserCreate } = require('../utils/validate');
const {
  createUser,
  login,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const NotFoundError = require('../utils/errors/NotFoundError');

router.post('/signup', validateUserCreate, createUser);
router.post('/signin', validateUserAuth, login);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница отсутствует'));
});

module.exports = router;
