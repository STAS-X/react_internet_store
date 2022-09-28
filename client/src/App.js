import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Context } from '.';
import AppRouter from './components/AppRouter';
import { IsAuth } from './components/http';
import {
	fetchBrands,
	fetchDevices,
	fetchTypes,
} from './components/http/deviceApi';
import { fetchOrders } from './components/http/orderApi';
import { fetchBaskets } from './components/http/basketApi';
import NavBar from './components/NavBar';

const App = observer(() => {
	const { device, basket, order } = useContext(Context);

	useEffect(() => {
		fetchOrders().then((data) => order.setOrders(data));
		fetchBaskets().then((data)=>basket.setBaskets(data));
		fetchTypes().then((data) => device.setTypes(data));
		fetchBrands().then((data) => device.setBrands(data));
		fetchDevices(device.devicesPerPage, device.activePage).then((data) => {
			device.setDevices(data.rows);
			device.setDevicesCount(data.count);
		});
	}, []);

	return (
		<BrowserRouter>
			<NavBar />
			<IsAuth />
			<AppRouter />
		</BrowserRouter>
	);
});

export default App;
