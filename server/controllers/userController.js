const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');

const generateJwt = (id, email, role) => {
	return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
		expiresIn: '24h',
	});
};

class UserController {
	async registration(req, res, next) {
		const { email, password, role } = req.body;
		if (!email || !password) {
			return next(ApiError.badRequest('Логин и/или пароль не заданы!'));
		}
		const candidate = await User.findOne({ where: { email } });

		if (candidate) {
			return next(
			ApiError.badRequest(`Пользователь с email [${email}] существует!`)
			);
			//ApiError.badRequest(`Пользователь с email [${email}] существует!`);
		}
		const hashPassword = await bcrypt.hash(password, 5);
		const user = await User.create({ email, role, password: hashPassword });
		const basket = await Basket.create({ userId: user.id });
		const token = generateJwt(user.id, user.email, user.role);

		return res.json({ token });
		//res.json({message:'registration started'})
	}

	async login(req, res, next) {
		const { email, password } = req.body;

		if (!email || !password) {
			return next(ApiError.badRequest('Логин и/или пароль не заданы!'));
		}
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return next(
				ApiError.internal(`Пользователь с email [${email}] не найден!`)
			);
		}
		//const hashPassword = await bcrypt.hash(password, 5);
		const isPassword = await bcrypt.compare(password, user.password);
		//console.log(isPassword,'Сравнение паролей');
		if (!isPassword) {
			return next(
				ApiError.badRequest(
					`Пользователь с email [${email}] указал неверный пароль!`
				)
			);
		}

		const token = generateJwt(user.id, user.email, user.role);
		return res.json({ token, email:user.email, userId:user.id, role:user.role });
	}

	async check(req, res, next) {
		const token = generateJwt(req.user.id, req.user.email, req.user.role);
		return res.json({ token });
	}
}

module.exports = new UserController();
