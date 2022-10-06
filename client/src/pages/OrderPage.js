import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import {
	Badge,
	Button,
	Col,
	Container,
	ListGroup,
	Row,
	Tab,
} from 'react-bootstrap';
import { Context } from '..';
import { clearBasket } from '../components/http/basketApi';
import { create } from '../components/http/orderApi';
import AlertingMessage from '../components/Alerting';
import BasketInfo from '../components/BasketInfo';
import ItemList from '../components/ItemList';
import PagingBar from '../components/PagingBar';
import OrderList from '../components/OrderList';
import { SHOP_ROUTE } from '../utils/consts';
import { useNavigate } from 'react-router-dom';

const OrderPage = observer(() => {
	const { user, order, device } = useContext(Context);

	const [userOrders, setUserOrders] = useState([]);
	const [indexOrder, setIndexOrder] = useState(0);
	const [page, setPage] = useState(1);

	const navigate = useNavigate();
	const format = (num = 0, decimals = 2) =>
		num.toLocaleString('ru-RU', {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		});

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
		<Container className="position-relative min-vh-100">
			<Tab.Container
				id="list-group-tabs-example"
				defaultActiveKey={`#link${userOrders[indexOrder]?.id}`}
			>
				<Row className="my-3">
					<h2>{`История заказов пользователя «${user.user.email}» ${
						userOrders.length > 0 ? '[' + userOrders.length + ' шт.] ' : ''
					}`}</h2>
					<hr />
				</Row>
				{userOrders.length > 0 && (
					<>
						<Row>
							<Col sm={5}>
								<ListGroup
									className="overflow-auto border border-1 border-dark"
									style={{ maxHeight: 675 }}
									numbered
								>
									{userOrders.map((order, ind) => {
										return (
											<ListGroup.Item
												key={order.id}
												variant="info"
												action
												className="d-flex justify-content-between align-items-start border border-3 border-light"
												active={ind === indexOrder}
												onClick={() => setIndexOrder(ind)}
											>
												<div className="ms-2 me-auto">
													<div className="fw-bold mb-3">{`Заказ №${order.uuid}`}</div>
													<div>
														{`Оформлен - ${new Date(
															order.createdAt
														).toLocaleTimeString('ru-RU', {
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														})}`}{' '}
													</div>
													<div>
														{`Общее количество товара - ${order.devices.reduce(
															(prev, cur) =>
																prev + Number(cur.order_device.count),
															0
														)} шт.`}{' '}
													</div>
													<div>
														{`Стоимость заказа - ${format(
															order.totalprice ||
																order.devices.reduce(
																	(prev, cur) =>
																		prev +
																		Number(cur.order_device.count) *
																			parseFloat(cur.price),
																	0
																)
														)} руб.`}{' '}
													</div>
												</div>
												<Badge bg="primary" pill>
													{order.devices.length}
												</Badge>
											</ListGroup.Item>
										);
									})}
								</ListGroup>
							</Col>
							<Col sm={7}>
								<Tab.Content>
									{userOrders.map((order, ind) => {
										return (
											<Tab.Pane
												key={order.id}
												active={ind === indexOrder}
												eventKey={`#link${order.id}`}
											>
												<OrderList orderIndex={indexOrder} />
											</Tab.Pane>
										);
									})}
								</Tab.Content>
							</Col>
						</Row>
					</>
				)}
				{userOrders.length === 0 && (
					<Row>
						<div className="mx-1 my-4">
							<h4>История заказов пуста!</h4>
							<Button
								variant="outline-dark"
								className="mt-3"
								onClick={() => navigate(SHOP_ROUTE)}
							>
								Вернуться в магзин
							</Button>
						</div>
					</Row>
				)}
			</Tab.Container>
			{userOrders.length > 0 && (
				<PagingBar
					activePage={page}
					setPage={setPage}
					perPage={device.devicesPerPage}
					perSegment={device.pagesPerSegment}
					count={userOrders[indexOrder].devices.length}
				/>
			)}
		</Container>
	);
});
export default OrderPage;
