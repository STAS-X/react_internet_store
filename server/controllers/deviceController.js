const { Device, DeviceInfo, Rating } = require('../models/models');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const { Op, col } = require('sequelize');

class DeviceController {
	async create(req, res, next) {
		try {
			let { name, price, rating, brandId, typeId, info } = req.body;

			const { img } = req.files;
			const { id: userId } = req.user;

			let filename = uuid.v4() + img?.name.split('.')[1];
			img?.mv(path.resolve(__dirname, '..', 'static', filename));

			const device = await Device.create({
				name,
				price,
				brandId,
				rating,
				typeId,
				userId,
				...(img ? { img: filename } : {}),
			});

			if (rating) {
				await Rating.create({
					rate: rating,
					deviceId: device.id,
					userId,
				});
			}
			if (info) {
				info = JSON.parse(info);
				if (info.length > 0)
					info.forEach(async (data) => {
						await DeviceInfo.create({
							title: data.title,
							description: data.description,
							deviceId: device.id,
						});
					});
			}

			return res.json(device);
		} catch (e) {
			next(ApiError.badRequest({ message: e.message }));
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;
			let { name, price, rating, brandId, typeId, info } = req.body;

			const { img } = req.files ? req.files : {};
			const { id: userId } = req.user;

			if (!id) {
				return next(
					ApiError.badRequest('Не задан параметр ID для устройства!')
				);
			}

			let filename = uuid.v4() + img?.name.split('.')[1];
			img?.mv(path.resolve(__dirname, '..', 'static', filename));

			const hasDevice = await Device.findOne({
				where: { id: { [Op.not]: id }, name },
			});
			//console.log(hasDevice,'get device by name')

			if (hasDevice) {
				return next(
					ApiError.badRequest(
						`Устройство с названием [${name}] существует, необходимо задать другое!`
					)
				);
			}

			if (rating) {
				const hasRating = await Rating.findOne({
					where: { deviceId: id, userId },
				});

				if (hasRating) {
					await Rating.update(
						{
							rate: rating,
						},
						{
							where: {
								deviceId: id,
								userId,
							},
						}
					);
				} else {
					await Rating.create({
						rate: rating,
						deviceId: id,
						userId,
					});
				}
			}
			// } else {
			// 	const rateCount = await DeviceInfo.destroy({
			// 		where: { deviceId: id, userId },
			// 	});
			// }

			// Обновляем характеристики устройства
			if (info) {
				info = JSON.parse(info);
				if (info.length > 0) {
					const infoCount = await DeviceInfo.destroy({
						where: { deviceId: id },
					});
					console.log(`Удалено ${infoCount} характеристик устройства`);
				}

				info.forEach(async (data) => {
					await DeviceInfo.create({
						title: data.title,
						description: data.description,
						deviceId: id,
					});
				});
			}
			// Обновляем текущее устройство
			await Device.update(
				{
					name,
					price,
					brandId,
					typeId,
					userId,
					...(img ? { img: filename } : {}),
				},
				{
					where: { id },
				}
			);

			// И возвращаем его для обновления на клиенте
			const device = await Device.findOne({
				where: { id },
				attributes: {
					include: ['createdAt'],
				},
				include: [
					{ model: DeviceInfo, as: 'info' },
					{
						model: Rating,
						as: 'rate',
						where: { deviceId: id },
					},
				],
			});

			return res.json(device);
		} catch (e) {
			next(ApiError.badRequest({ message: e.message }));
		}
	}

	async getAll(req, res) {
		let { brandId, typeId, limit, page } = req.query;
		page = page || 1;
		limit = limit || 10;
		let offset = (page - 1) * limit;

		//const userId = req.user?.id;

		const devices = await Device.findAndCountAll({
			where: Object.assign({}, brandId && { brandId }, typeId && { typeId }),
			order: ['id'],
			attributes: {
				include: ['createdAt'],
			},
			include: [
				{
					model: Rating,
					as: 'rate',
				},
			],
			limit,
			offset,
		});
		return res.json(devices);
	}

	async getById(req, res, next) {
		const { id } = req.params;
		//const userId = req.user?.id;

		if (!id) {
			return next(ApiError.badRequest('Не задан параметр ID для устройства!'));
		}
		const device = await Device.findOne({
			where: { id },
			attributes: {
				include: ['createdAt'],
			},
			include: [
				{ model: DeviceInfo, as: 'info' },
				{
					model: Rating,
					as: 'rate',
				},
			],
		});

		if (!device) {
			return next(ApiError.badRequest(`Не найдено устройство [${id}]!`));
		}
		//console.log(device.rate, 'rate');
		return res.json(device);
	}
}

module.exports = new DeviceController();
