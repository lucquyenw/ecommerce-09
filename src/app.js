require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const { checkOverload } = require('./helpers/checkConnect');
const globalErrorHandler = require('./controllers/error.controller');
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

//handling error
app.all('*', (req, res, next) => {
	const error = new Error('Not found');
	err.status = 404;
	next(error);
});

app.use(globalErrorHandler);

module.exports = app;
