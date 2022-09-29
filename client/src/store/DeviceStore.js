import { makeAutoObservable } from 'mobx';

export default class DeviceStore {
	constructor() {
		this._types = [];
		this._brands = [];
		this._devices = [];

		this._devicesCount = 0;
		this._devicesPerPage = 8;
		this._pagesPerSegment = 5;
		this._selectedPage = 1;
		this._selectedType = {};
		this._selectedBrand = {};

		makeAutoObservable(this);
	}

	setTypes(types) {
		this._types = types;
	}

	setBrands(brands) {
		this._brands = brands;
	}

	setDevices(devices) {
		this._devices = devices;
	}

	setDevicesCount(count) {
		this._devicesCount = count;
	}

	setDevicesPerPage(perPage) {
		this._devicesPerPage = perPage;
	}

	setPageserSegnment(perSegment) {
		this._pagesPerSegment = perSegment;
	}

	setSelectedPage(page) {
		this._selectedPage = page;
	}

	setSelectedType(type) {
		if (this._selectedType.id !== type.id) {
			this._selectedType = type;
		} else {
			this._selectedType = {};
		}
	}

	setSelectedBrand(brand) {
		if (this._selectedBrand.id !== brand.id) {
			this._selectedBrand = brand;
		} else {
			this._selectedBrand = {};
		}
	}

	get types() {
		return this._types;
	}

	get brands() {
		return this._brands;
	}

	get devices() {
		return this._devices;
	}

	get devicesCount() {
		return this._devicesCount;
	}

	get devicesPerPage() {
		return this._devicesPerPage;
	}

	get pagesPerSegment() {
		return this._pagesPerSegment;
	}

	get selectedPage() {
		return this._selectedPage;
	}

	get selectedType() {
		return this._selectedType;
	}
	get selectedBrand() {
		return this._selectedBrand;
	}
}
