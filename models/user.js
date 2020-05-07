const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true, required: true },
	password: { type: String, required: true },
});

userSchema.pre('save', function (next) {
	const user = this;
	bcrypt.genSalt(10, (err, salt) => {
		if (err) {
			return next(err);
		}

		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) {
				return next(err);
			}

			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);
