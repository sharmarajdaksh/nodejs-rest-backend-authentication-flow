const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
const router = require('./router');
const config = require('./config');

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

app.use(router);

const port = process.env.PORT || 3000;

mongoose.connect(
	config.MONGO_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		app.listen(port, () => {
			console.log('Server listening on port', port);
		});
	}
);
