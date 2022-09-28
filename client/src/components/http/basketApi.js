import { $host } from '.';

export const addToBasket = async (deviceId, basketId) => {
	const { data } = await $host.post('api/basket', {
		deviceId,
		basketId,
	});
	return data;
};

export const updateBasketDevice = async (deviceId, basketId, count) => {
	const { data } = await $host.put('api/basket', {
		deviceId,
		basketId,
		count,
	});
	return data;
};

export const deleteFromBasket = async (deviceId, basketId) => {
	const { data } = await $host.delete('api/basket', {
		params: {
			deviceId,
			basketId,
		},
	});
	return data;
};

export const clearBasket = async (basketId) => {
	const { data } = await $host.delete('api/basket/' + basketId);
	return data;
};

export const fetchBaskets = async () => {
	const { data } = await $host.get('api/basket');
	return data;
};
