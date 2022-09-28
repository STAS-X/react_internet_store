const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken');

module.exports = function (role) {
	return (req, res, next) => {
		if (req.method === 'OPTIONS') {
			next();
		}

		try {
			const token = req.headers.authorization.split(' ')[1];
			if (!token) {
				return next(ApiError.forbidden('Пользователь не авторизован!'));
			}
			const decoded = jwt.verify(token, process.env.SECRET_KEY);
			if (decoded.role !== role) {
				return next(ApiError.forbidden('Не достаточно прав на операцию!'));
			}

			req.user = decoded;
			next();
		} catch (e) {
			return next(ApiError.forbidden('Пользователь не авторизован!'));
		}
	};
};
