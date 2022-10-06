import { makeAutoObservable } from 'mobx';

export default class OrderStore {
	constructor() {
		this._orders = [];
		makeAutoObservable(this);
	}

	addNewOrder(order) {
		this._orders.push(order);
	}

	updateDevice(userId, device) {
			this._orders
				.forEach((order) => {
					if (order.userId === userId) {
						if (order.devices.findIndex((dev) => dev.id === device.id)>-1)
						order.devices[order.devices.findIndex((dev) => dev.id === device.id)]={...order.devices.find((dev) => dev.id === device.id),...device};
					}

				});
				
	}

	setOrders(orders) {
		this._orders = orders;
	}

	get orders() {
		return this._orders;
	}
}
