import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';
import star from '../assets/star.png';
import { DEVICE_ROUTE } from '../utils/consts';

const DeviceItem = ({ device, brand }) => {
	const { user } = useContext(Context);
	const [rate, setRate] = useState(0);

	const navigate = useNavigate();

	useEffect(() => {
		if (user.isAuth) {
			if (device.rate?.find((rate) => rate.userId === user.user.userId))
				setRate(
					parseFloat(
						device.rate.find((rate) => rate.userId === user.user.userId).rate
					).toFixed(1)
				);
		} else {
			if (device.rate?.filter((rate) => rate.rate > 0).length > 0) {
				const newRate = device.rate
					.filter((rate) => rate.rate > 0)
					.reduce((prev, rate) => prev + rate.rate, 0);
				setRate(
					parseFloat(
						newRate / device.rate.filter((rate) => rate.rate > 0).length
					).toFixed(1)
				);
			}
		}
	}, []);

	return (
		<Col md={3} onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}>
			<Card
				border="light"
				style={{ width: 150, cursor: 'pointer', marginTop: 10 }}
			>
				<Image
					width={150}
					height={150}
					src={process.env.REACT_APP_API_URL + device.img}
				/>
				<div className="d-flex justify-content-between align-items-center my-2">
					<div className="text-black-50">
						{brand?.name ? brand.name : 'Без названия'}
					</div>
					<div className="d-flex align-items-center ">
						<div className="mx-1">{rate}</div>
						<Image width={16} height={16} src={star} />
					</div>
				</div>
				<div>{device.name}</div>
				{device.basket_device && (
					<div>{`Количество: ${device.basket_device.count} шт.`} </div>
				)}
				{device.order_device && (
					<div>{`Количество: ${device.order_device.count} шт.`} </div>
				)}
			</Card>
		</Col>
	);
};
export default DeviceItem;
