const jwt = require('jsonwebtoken');
const User = require('../models/user');

const config = require('../config');

const tokenForUser = (user) => {
	const timestamp = new Date().getTime();

	// sub is the subject; iat is the issued at time
	return jwt.sign({ sub: user._id, iat: timestamp }, config.TOKEN_SECRET);
};

exports.signup = (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res
			.status(422)
			.send({ error: 'You must provide an email and password' });
	}

	User.findOne({ email: email })
		.then((user) => {
			if (user) {
				return res.status(422).send({ error: 'User already exists' });
			}

			const newUser = new User({
				email,
				password,
			});

			return newUser.save().then((user) => {
				return res.status(201).json({ token: tokenForUser(user) });
			});
		})
		.catch((err) => {
			if (err) {
				return next(err);
			}
		});
};

exports.signin = (req, res, next) => {
    // req.user gets assigned by the password middleware
	res.send({ token: tokenForUser(req.user) });
};
