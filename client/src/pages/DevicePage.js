import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
	Button,
	Card,
	Col,
	Container,
	Form,
	Image,
	Row,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import star from '../assets/star_rating.png';
import {
	addToBasket,
	deleteFromBasket,
	updateBasketDevice,
} from '../components/http/basketApi';
import { fetchOneDevice } from '../components/http/deviceApi';
import CreateDevice from '../components/modals/CreateDevice';

const DevicePage = observer(() => {
	const { device: dev, user, basket } = useContext(Context);

	const { id } = useParams();
	const [userBasket, setUserBaket] = useState({});
	const [device, setDevice] = useState({ info: [] });
	const [deviceCount, setDeviceCount] = useState(0);
	const [brand, setBrand] = useState({});
	const [deviceShow, setDeviceShow] = useState(false);
	const basketRef = useRef();

	const handleChangeDeviceCount = ({ target }) => {
		if (!isNaN(target.value) && target.value > 0) {
			const newCount = Math.ceil(target.value);
			setDeviceCount(newCount);
			basketRef.current = { ...basketRef.current, count: newCount };
			//basket.updateBasketDevice(user.user.userId, Number(id), newCount);
			// updateBasketDevice(id, userBasket.id, newCount);
		}
	};

	const hasDeviceInUserBasket = () => {
		if (userBasket?.devices) {
			return userBasket.devices.findIndex((dev) => dev.id === Number(id)) > -1;
		}
		return false;
	};

	const getBasketDeviceCount = () => {
		if (
			userBasket?.devices &&
			userBasket.devices.find((dev) => dev.id === Number(id))
		) {
			return userBasket.devices.find((dev) => dev.id === Number(id))
				.basket_device.count;
		}
		return ;
	};

	const addDeviceInUserBasket = () => {
		addToBasket(id, userBasket.id);
		basket.pushToBasket(user.user.userId, device);
		setUserBaket(
			...basket.baskets.filter((basket) => basket.userId === user.user.userId)
		);
	};

	const removeDeviceFromUserBasket = () => {
		deleteFromBasket(id, userBasket.id);
		basket.removeFromBasket(user.user.userId, device);
		setUserBaket(
			...basket.baskets.filter((basket) => basket.userId === user.user.userId)
		);
	};

	useEffect(() => {
		setUserBaket(
			...basket.baskets.filter((basket) => basket.userId === user.user.userId)
		);
	}, [user.user, basket.bakets]);

	useEffect(() => {
		if (hasDeviceInUserBasket) {
			setDeviceCount(getBasketDeviceCount());
		}
		basketRef.current={...basketRef.current, basketId:userBasket?.id};
	}, [userBasket]);

	useEffect(() => {
		setBrand(dev.brands.find((brand) => brand.id === device.brandId));
	}, [device]);

	useEffect(() => {
		fetchOneDevice(id).then((data) => {
			setDevice(data);
			// setTimeout(()=>
			// setBrand(dev.brands.find((brand) => brand.id === data.brandId)),1);
		});
		return () => {
			const { basketId, count } = basketRef.current;
			if (count > 0) {
				basket.updateBasketDevice(user.user.userId, Number(id), count);
				updateBasketDevice(id, basketId, count);
			}
		};
	}, []);

	return (
		<Container className="mt-3">
			<Row>
				<Col md={4}>
					<Image
						width={300}
						height={300}
						src={device.img ? process.env.REACT_APP_API_URL + device.img : ''}
					/>
					{brand && (
						<h1
							className="my-3 text-info bg-teal bg-gradient"
							style={{ maxWidth: 'fit-content' }}
						>
							{brand.name}
						</h1>
					)}
				</Col>
				<Col md={4}>
					<Row className="d-flex flex-column align-items-center">
						<h2>{device.name}</h2>
						<div
							className="d-flex align-items-center justify-content-center"
							style={{
								background: `url(${star}) no-repeat center center`,
								width: 280,
								height: 280,
								marginLeft: -240,
								fontSize: 64,
								backgroundSize: 'cover',
							}}
						>
							{device.rate?.length > 0 ? device.rate[0].rate : device.rating}
						</div>
					</Row>
				</Col>
				<Col md={4}>
					<Card
						className="d-flex flex-column align-items-center justify-content-center"
						style={{
							width: 300,
							height: 300,
							fontSize: 32,
							border: '5px solid lightgray',
						}}
					>
						<h3>цена: {device.price} руб.</h3>
						{hasDeviceInUserBasket() && (
							<div className="d-flex flex-row align-items-center my-2">
								<Form.Label className="fs-4">Количество</Form.Label>
								<Form.Control
									className="m-2 w-auto"
									placeholder="Введите количество товара"
									value={deviceCount||1}
									onChange={(e) => handleChangeDeviceCount(e)}
									type="number"
									min={1}
									max={30}
								/>
							</div>
						)}
						{userBasket && (
							<Button
								variant={
									hasDeviceInUserBasket() ? 'outline-danger' : 'outline-dark'
								}
								className={`mt-3 ${
									user.isAuth ? '' : 'bg-secondary text-light'
								}`}
								disabled={!user.isAuth}
								onClick={() => {
									if (hasDeviceInUserBasket()) {
										removeDeviceFromUserBasket();
									} else {
										addDeviceInUserBasket();
									}
								}}
							>
								{hasDeviceInUserBasket()
									? 'Удалить из коризины'
									: 'Добавить в корзину'}
							</Button>
						)}
						<Button
							variant="outline-dark"
							className={`mt-3 ${user.isAuth ? '' : 'bg-secondary text-light'}`}
							disabled={!user.isAuth}
							onClick={() => setDeviceShow((prev) => !prev)}
						>
							Редактировать товар
						</Button>
					</Card>
				</Col>
			</Row>
			<Row className="mt-3">
				<h1>Характеристики</h1>
				{device.info?.map((info, index) => (
					<Row
						key={info.id}
						style={{
							background: index % 2 === 0 ? 'lightgray' : 'transparent',
							padding: 10,
							marginLeft: 10,
						}}
					>
						{info.title} : {info.description}
					</Row>
				))}
			</Row>
			<CreateDevice
				show={deviceShow}
				deviceId={id}
				setDevice={setDevice}
				onHide={() => setDeviceShow(false)}
			/>
		</Container>
	);
});
export default DevicePage;
