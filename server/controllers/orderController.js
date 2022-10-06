const { Order, OrderDevice, Rating, Device } = require('../models/models');
const sequelize = require('../db');
const { col, Op } = require('sequelize');
const ApiError = require('../error/ApiError');

class OrderController {
	async create(req, res, next) {
		const { devices } = req.body;
		const userId = req.user?.id;
		let order;

		try {
			console.log(devices, userId, 'new order');

			// Считаем общую стоимость и добавляем в базу новый заказ
			const totalPrice = devices.reduce(
				(total, cur) => total + cur.price * cur.basket_device.count,
				0
			);

			order = await Order.create({ userId, totalPrice });
			console.log(order, 'new order');

			// Обновляем поле orderId для всех устройств в заказе
			const updatedDevices = devices.map((dev) => {
				return {
					orderId: order.id,
					deviceId: dev.id,
					count: dev.basket_device.count,
				};
			});

			const orderItems = await OrderDevice.bulkCreate(updatedDevices, {
				validate: true,
			});

			if (orderItems.length > 0) {
				order = await Order.findOne({
					where: { uuid: order.uuid },
					include: [
						{
							model: Device,
							through: {
								attributes: ['id', 'deviceId', 'count'],
							},
						},
					],
				});
			} else {
				return next(
					ApiError.badRequest(
						`При оформлении заказа ${order.uuid} произошла ошибка!`
					)
				);
			}

			return res.json(order);
		} catch (e) {
			console.log(e.message, 'error in query');
			return res.status(e.status).json({ message: e.message });
		}
	}

	async getAll(req, res) {
		try {
			const response = await Order.findAll({
				order: [['createdAt', 'ASC']],
				include: [
					{
						model: Device,
						include: [
							{
								model: Rating,
								as: 'rate',
							},
						],
						through: {
							attributes: ['id', 'deviceId', 'count'],
						},
					},
				],
			});

			return res.json(response);
		} catch (e) {
			console.log(e.message, 'error in query');
			return res.status(e.status).json({ message: e.message });
		}
	}
	async getById(req, res, next) {
		const { id } = req.params;

		if (!id) {
			return next(ApiError.badRequest('Не задан параметр ID (номер) заказа!'));
		}
		const order = await Order.findOne({
			where: { uuid: id },
			include: [
				{
					model: Device,
					include: [
						{
							model: Rating,
							as: 'rate',
						},
					],
					through: {
						attributes: ['id', 'deviceId', 'count'],
					},
				},
			],
		});

		if (!order) {
			return next(ApiError.badRequest(`Заказ ${id} не найден!`));
		}

		return res.json(order);
	}
}

module.exports = new OrderController();
