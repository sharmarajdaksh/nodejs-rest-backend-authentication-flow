const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localLogin = new LocalStrategy(
	{ usernameField: 'email' },
	(email, password, done) => {
		User.findOne({ email: email })
			.then((user) => {
				if (!user) {
					return done(null, false);
				}

				return user.comparePassword(password, (err, isMatch) => {
					if (err) {
						return done(err);
					}
					if (!isMatch) {
						return done(null, false);
					}
					return done(null, user);
				});
			})
			.catch((err) => {
				return done(err);
			});
	}
);

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.TOKEN_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
	User.findById(payload.sub)
		.then((user) => {
			if (!user) {
				return done(null, false);
			}
			return done(null, user);
		})
		.catch((err) => {
			return done(err, false);
		});
});

passport.use(jwtLogin);
passport.use(localLogin);
