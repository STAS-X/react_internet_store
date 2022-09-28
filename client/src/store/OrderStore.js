import { makeAutoObservable } from 'mobx';

export default class OrderStore {
	constructor() {
		this._orders = [];
		makeAutoObservable(this);
	}

	addNewOrder(order) {
		this._orders.push(order);
	}

	setOrders(orders) {
		this._orders = orders;
	}

	get orders() {
		return this._orders;
	}
}
