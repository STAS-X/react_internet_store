import { makeAutoObservable } from 'mobx';

export default class BasketStore {
	constructor() {
		this._baskets = [];
		makeAutoObservable(this);
	}

	pushToBasket(userId, device) {
		if (
			this._baskets
				.find((basket) => basket.userId === userId)
				?.devices.findIndex((dev) => dev.id === device.id) < 0
		)
			this._baskets
				.find((basket) => basket.userId === userId)
				.devices.push({ ...device, basket_device: { count: 1 } });
	}

	updateBasketDevice(userId, deviceId, { count, rating }) {
		if (
			this._baskets
				.find((basket) => basket.userId === userId)
				?.devices.findIndex((dev) => dev.id === deviceId) > -1
		) 
			this._baskets
				.find((basket) => basket.userId === userId)
				.devices.find((dev) => dev.id === deviceId).basket_device.count = count;

		
	}

	removeFromBasket(userId, device) {
		if (
			this._baskets
				.find((basket) => basket.userId === userId)
				?.devices.findIndex((dev) => dev.id === device.id) > -1
		)
			this._baskets.find((basket) => basket.userId === userId).devices =
				this._baskets
					.find((basket) => basket.userId === userId)
					.devices.filter((dev) => dev.id !== device.id);
	}

	clearBasket(userId) {
		if (this._baskets.find((basket) => basket.userId === userId))
			this._baskets.find((basket) => basket.userId === userId).devices = [];
	}

	setBaskets(baskets) {
		this._baskets = baskets;
	}

	get baskets() {
		return this._baskets;
	}
}
