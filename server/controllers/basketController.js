const { Basket, BasketDevice, Device } = require('../models/models');
const sequelize = require('../db');
const { col, Op } = require('sequelize');
const ApiError = require('../error/ApiError');

class BasketController {
	async addTo(req, res, next) {
		const { deviceId, basketId } = req.body;

		// Проверяем на отсутствие в корзине добавляемого устройства
		const deviceInBasket = await BasketDevice.findOne({
			where: { deviceId, basketId },
		});

		if (deviceInBasket) {
			next(
				ApiError.badRequest(
					`Устройство [id - ${deviceId}] уже находится в корзине`
				)
			);
		}

		const basketItem = await BasketDevice.create({ deviceId, basketId });
		return res.json(basketItem);
	}

	async deleteFrom(req, res, next) {
		const { deviceId, basketId } = req.query;

		// Проверяем на отсутствие в корзине добавляемого устройства
		const deviceInBasket = await BasketDevice.findOne({
			where: { deviceId, basketId },
		});

		if (!deviceInBasket) {
			next(
				ApiError.badRequest(
					`Устройство [id - ${deviceId}] отсутствует в корзине`
				)
			);
		}

		const basketCount = await BasketDevice.destroy({
			where: { deviceId, basketId },
		});
		return res.json({ deviceId, basketId });
	}

	async clearBasket(req, res, next) {
		const { id } = req.params;
		
		const basketCount = await BasketDevice.destroy({
			where: { basketId:id },
		});
	
		return res.json({ id });
	}

	async updateDevice(req, res) {
		try {
			const { deviceId, basketId, count } = req.body;

			const basketDevice = await BasketDevice.findOne({
				where: { [Op.and]: [{ basketId }, { deviceId }] },
			});

			const updatedDevice = await basketDevice.update(
				{ count },
				{ returning: true, plain: true }
			);
			await updatedDevice.save();

			return res.json(updatedDevice);
		} catch (e) {
			console.log(e.message, 'error executed');
			return res.status(e.status).json({ message: e.message });
		}
	}

	async getAll(req, res) {
		try {
			const response = await Basket.findAll({
				order:['id'],
				include: [
					{
						model: Device,
						through: {
							attributes: ['id', 'deviceId', 'count'],
						},
						// 	model: Device,
						// 	where: {
						// 		id: sequelize.col('basket_device.deviceId'),
						// 	},
						// },
					},
				],
			});

			// console.log(
			// 	response.toJSON(),
			// 	' basket device model'
			// );

			// const countToUpdate = response.devices;
			// countToUpdate[0].basket_device.count = 7;
			// await response.update({ devices: countToUpdate });
			// await response.save();
			// await response.devices[0].basket_device.save();

			//response.reload();
			// console.log(
			// 	response.toJSON().devices[0].basket_device,
			// 	' after update'
			// );

			// const basket = await BasketDevice.findOne({
			// 	where: { [Op.and]: [{ basketId: 9 }, { deviceId: 4 }] },
			// });

			// console.log(basket.toJSON(), 'basket device before update');
			// //basket.increment(['count'], {by:2});
			// const updBasket = await basket.update(
			// 	{ count: 14 },
			// 	{ returning: true, individualHooks: true, plain: true }
			// );

			// console.log(updBasket.toJSON(), 'basket device after update');

			return res.json(response);
		} catch (e) {
			console.log(e.message, 'error in query');
			return res.status(e.status).json({ message: e.message });
		}
	}
}

module.exports = new BasketController();
