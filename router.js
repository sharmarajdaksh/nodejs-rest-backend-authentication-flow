const express = require('express');
const passport = require('passport');

const passportService = require('./services/passport');
const authController = require('./controllers/authentication');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const router = express.Router();

router.get('/', requireAuth, (req, res, next) => {
	res.send({ message: 'Hi' });
});
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router;
