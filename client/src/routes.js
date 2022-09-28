import Admin from './pages/Admin';
import Auth from './pages/Auth';
import BasketPage from './pages/BasketPage';
import DevicePage from './pages/DevicePage';
import OrderPage from './pages/OrderPage';
import Shop from './pages/Shop';
import {
	ADMIN_ROUTE,
	BASKET_ROUTE,
	ORDER_ROUTE,
	DEVICE_ROUTE,
	LOGIN_ROUTE,
	REGISTRATION_ROUTE,
	SHOP_ROUTE,
} from './utils/consts';

export const authRoutes = [
	{ path: ADMIN_ROUTE, component: <Admin />, exact: true },
	{ path: BASKET_ROUTE, component: <BasketPage />, exact: true },
		{ path: ORDER_ROUTE, component: <OrderPage />, exact:true },
];

export const publicRoutes = [
	{ path: SHOP_ROUTE, component: <Shop /> },
	{ path: LOGIN_ROUTE, component: <Auth /> },
	{ path: REGISTRATION_ROUTE, component: <Auth /> },
	{ path: DEVICE_ROUTE + '/:id', component: <DevicePage /> },
	{ path: '/', component: <Shop /> },
];
