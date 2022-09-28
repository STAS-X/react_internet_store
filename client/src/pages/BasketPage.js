import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Context } from '..';
import { clearBasket } from '../components/http/basketApi';
import { create } from '../components/http/orderApi';
import AlertingMessage from '../components/Alerting';
import BasketInfo from '../components/BasketInfo';
import ItemList from '../components/ItemList';
import PagingBar from '../components/PagingBar';

const BasketPage = observer(() => {
	const { device, user, basket, order } = useContext(Context);
	const [userBasket, setUserBasket] = useState({});
	const [page, setPage] = useState(1);

	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState('');
	const [headAlert, setHeadAlert] = useState('');
	const [messageAlert, setMessageAlert] = useState('');

	const handlePlaceNewOrder = async () => {
		create(userBasket.devices)
			.then(async (data) => {
				order.addNewOrder(data);
				clearBasket(userBasket.id);	
				basket.clearBasket(userBasket.id, user.user.userId);
				// Показываем всплывающую подсказку, если обработка заказа прошла успешно
				setHeadAlert('Сообщение о добавлении нового заказа');
				setMessageAlert(`Новый заказ ${data.uuid} оформлен успешно!`);
				setTypeAlert('success');
				setShowAlert(true);
			})
			.catch((error) => {
				// Показываем всплывающую подсказку, при возникновении ошибки
				setHeadAlert('Сообщение об ошибке');
				setMessageAlert(`При оформлении возникла ошибка: ${error.message}`);
				setTypeAlert('danger');
				setShowAlert(true);
			});
	};

	useEffect(() => {
		setUserBasket(
			...basket.baskets.filter((bsk) => bsk.userId === user.user.userId)
		);
	}, [user.user, basket.baskets]);

	return (
		<Container className="position-relative min-vh-100">
			<Row className="mt-3">
				<h2>{`Корзина пользователя «${user.user.email}»`}</h2>
				<hr />
			</Row>
			<Row className="mt-3 gap-5 ">
				<Col md={3}>
					<BasketInfo basket={userBasket} addNewOrder={handlePlaceNewOrder} />
				</Col>
				<Col md={8}>
					<AlertingMessage
						show={showAlert}
						setShow={setShowAlert}
						type={typeAlert}
						headText={headAlert}
						messageText={messageAlert}
					/>
					<ItemList />
				</Col>
			</Row>
			{userBasket?.devices?.length > 0 && (
				<PagingBar
					activePage={page}
					setPage={setPage}
					perPage={device.devicesPerPage}
					perSegment={device.pagesPerSegment}
					count={userBasket.devices.length}
				/>
			)}
		</Container>
	);
});
export default BasketPage;
