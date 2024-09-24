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
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
//init db.
require('./dbs/init.mongodb.js');
// checkOverload();

//init router.
app.use('', require('./routers'));

//handle error

module.exports = app;
