import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';
import { SHOP_ROUTE } from '../utils/consts';
import DeviceItem from './DeviceItem';

const ItemList = observer(() => {
	const { device, basket, user } = useContext(Context);
	const [userBasket, setUserBasket] = useState({});

	const navigate = useNavigate();

	useEffect(() => {
		setUserBasket(
			...basket.baskets.filter((bsk) => bsk.userId === user.user.userId)
		);
	}, [user.user, basket.baskets]);

	return (
		<Row className="d-flex">
			{userBasket?.devices?.map((dev) => (
				<DeviceItem
					key={dev.id}
					device={userBasket.devices.find((device) => device.id === dev.id)}
					brand={device.brands.find((brand) => brand.id === dev.brandId)}
				/>
			))}
			{userBasket?.devices?.length === 0 && user.isAuth && (
				<div className="mx-1 my-4">
					<h4>Корзина пуста!</h4>
					<Button
						variant="outline-dark"
						className="mt-3"
						onClick={() => navigate(SHOP_ROUTE)}
					>
						Вернуться в магзин
					</Button>
				</div>
			)}
		</Row>
	);
});
export default ItemList;
