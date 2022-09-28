const ApiError = require('../error/ApiError');

module.exports = function (err, req, res, next) {

	if (err instanceof ApiError) {
		return res.status(err.status).json({ status: err.status, message: err.message, stack: err.stack });
	}
	if (err) {
		return res.status(500).json({ message: 'Ошибка на сервере!' });
	}
};
