import { $authHost, $host } from '.';

export const createType = async (type) => {
	const { data } = await $authHost.post('api/type', type);
	return data;
};

export const fetchTypes = async () => {
	const { data } = await $host.get('api/type');
	return data;
};

export const createBrand = async (brand) => {
	const { data } = await $authHost.post('api/brand', brand);
	return data;
};

export const fetchBrands = async () => {
	const { data } = await $host.get('api/brand');
	return data;
};

export const createDevice = async (device) => {
	const deviceData = new FormData();
	Object.keys(device).map((key) => {
		const args = [key, device[key]];
		if (key === 'img') args.push(device[key].name);
		deviceData.append.apply(deviceData, args);
	});

	const { data } = await $authHost.post('api/device', deviceData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return data;
};

export const updateDevice = async (device) => {
	//console.log(device.info, 'device to update');
	const deviceData = new FormData();
	Object.keys(device).map((key) => {
		const args = [key, device[key]];
		if (key === 'img') args.push(device[key].name);
		deviceData.append.apply(deviceData, args);
	});

	const { data } = await $authHost.put('api/device/' + device.id, deviceData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return data;
};

export const fetchDevices = async (limit, page, brandId, typeId) => {
	const { data } = await $host.get('api/device', {
		params: { limit, page, brandId, typeId },
	});
	return data;
};

export const fetchOneDevice = async (id) => {
	const { data } = await $host.get('api/device/' + id);
	return data;
};
