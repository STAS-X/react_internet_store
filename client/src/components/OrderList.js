import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';
import { SHOP_ROUTE } from '../utils/consts';
import DeviceItem from './DeviceItem';

const OrderList = observer(({orderIndex}) => {
	const { device, order,  user } = useContext(Context);
	const [userOrders, setUserOrders] = useState([]);
	
	const navigate = useNavigate()

		useEffect(() => {
			setUserOrders(
				order.orders.filter((order) => order.userId === user.user.userId)
			);
		}, [user.user, order.orders]);

		useEffect(() => {
			setUserOrders(
				order.orders.filter((order) => order.userId === user.user.userId)
			);
		}, []);


	return (
		<Row className="d-flex">
			{userOrders[orderIndex]?.devices?.map((dev) => (
				<DeviceItem
					key={dev.id}
					device={device.devices.find((device) => device.id === dev.id)}
					brand={device.brands.find((brand) => brand.id === dev.brandId)}
				/>
			))}
			{userOrders[orderIndex]?.devices?.length === 0 && user.isAuth && (
				<div className="mx-1 my-4">
					<h4>Заказ пуст!</h4>
					{/* <Button variant="outline-dark" className="mt-3" onClick={()=>navigate(SHOP_ROUTE)}>
						Вернуться в магзин
					</Button> */}
				</div>
			)}
		</Row>
	);
});
export default OrderList;
