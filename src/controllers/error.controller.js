module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'dev') {
		console.log(err);
		return res.status(err.statusCode).json({
			status: err.statusCode,
			message: err.message,
		});
	} else {
		return res.status(err.statusCode).json({
			status: err.statusCode,
			message: err.message,
		});
	}
};
