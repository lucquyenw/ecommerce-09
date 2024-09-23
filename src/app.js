require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const { checkOverload } = require('./helpers/checkConnect.js');
const app = express();

//init middleware.
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

//init db.
require('./dbs/init.mongodb.js');
// checkOverload();

//init router.
app.get('/', (req, res) => {
	return res.status(200).json({
		message: 'Welcome FanTipJs!',
	});
});

//handle error

module.exports = app;
