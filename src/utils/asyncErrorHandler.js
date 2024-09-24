module.exports = (func) => {
	return (req, res, next) => {
		const error = func(req, res, next);
		if (error) {
			error.catch((err) => next(err));
		}
	};
};
