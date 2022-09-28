import { $host } from '.';

export const create = async (devices) => {
	const { data } = await $host.post('api/order', {
		devices,
	});
	return data;
};

export const fetchOrders = async () => {
	const { data } = await $host.get('api/order');
	return data;
};

export const fetchOneOrder = async (id) => {
	const { data } = await $host.get('api/order/'+id);
	return data;
};