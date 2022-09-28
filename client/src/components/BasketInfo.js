import React, {useState} from 'react';
import { Button, Card } from 'react-bootstrap';
import AlertingMessage from './Alerting';
import { useNavigate } from 'react-router-dom';
import { SHOP_ROUTE } from '../utils/consts';

const BasketInfo = ({ basket, addNewOrder }) => {
    const navigate = useNavigate();

    const format = (num=0, decimals = 2) => 
			num.toLocaleString('ru-RU', {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			});

	return (
		<Card
			border="primary"
			bg="light"
			text="dark"
			style={{ width: 330, marginTop: 10 }}
		>
			<Card.Header className="mb-3">
				<Card.Title>Статистика корзины</Card.Title>
				<Card.Subtitle className="text-muted">{`выбрано ${basket.devices?.length} тов.`}</Card.Subtitle>
			</Card.Header>
			<Card.Body>
				<Card.Text>
					{`Всего выбранных устройств - ${basket.devices?.reduce(
						(prev, cur) => prev + Number(cur.basket_device.count),
						0
					)} шт.`}
				</Card.Text>
				<Card.Text>
					{`Общая стоимость - ${format(basket.devices?.reduce(
						(prev, cur) =>
							prev +
							Number(cur.basket_device.count) * parseFloat(cur.price),
						0
					))} руб.`}
				</Card.Text>
			</Card.Body>
			<Card.Footer className="d-flex flex-column justify-items-center">
				<Button className="w-auto my-2" disabled={basket.devices?.length===0} variant="outline-success" onClick={addNewOrder}>
					Оформить заказ
				</Button>
				<Button
					className="w-auto my-2"
					variant="outline-dark"
					onClick={() => navigate(SHOP_ROUTE)}
				>
					Перейти к покупкам
				</Button>
			</Card.Footer>
		</Card>
	);
};
export default BasketInfo;
