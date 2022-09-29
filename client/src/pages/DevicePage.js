import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
	Button,
	Card,
	Col,
	Container,
	Figure,
	Form,
	Image,
	Row,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import star from '../assets/star_rating.png';
import ratingFull from '../assets/rating_full.png';
import ratingEmpty from '../assets/rating_empty.png';

import {
	addToBasket,
	deleteFromBasket,
	updateBasketDevice,
} from '../components/http/basketApi';
import { updateDevice, fetchOneDevice } from '../components/http/deviceApi';
import CreateDevice from '../components/modals/CreateDevice';

const DevicePage = observer(() => {
	const { device: dev, user, basket } = useContext(Context);

	const { id } = useParams();
	const [userBasket, setUserBaket] = useState({});
	const [device, setDevice] = useState({ info: [] });
	const [deviceCount, setDeviceCount] = useState(0);
	const [rating, setRating] = useState(0);
	const [userRating, setUserRating] = useState(0);
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
		return;
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

	const updateDeviceRating = ({ nativeEvent }) => {
		let newRating;
		if (!user.isAuth) return;
		if (Math.ceil(nativeEvent.layerX / 30) === rating && rating === 1) {
			newRating = 0;
		} else if (Math.ceil(nativeEvent.layerX / 30) !== rating)
			newRating = Math.ceil(nativeEvent.layerX / 30);
		if (newRating) {
			setRating(newRating);
			if (
				device.rate.length === 0 ||
				!device.rate.find((rate) => rate.userId === user.user.userId)
			) {
				device.rate.push({
					userId: user.user.userId,
					deviceId: device.id,
					rate: newRating,
				});
			} else if (device.rate.find((rate) => rate.userId === user.user.userId)) {
				device.rate.find((rate) => rate.userId === user.user.userId).rate =
					newRating;
			}
			device.rating = newRating;
			basketRef.current = { ...basketRef.current, device };
			dev.setDevices([...dev.devices.filter(dev=> dev.id!==device.id), device]);
			updateUserRating();
		}
	};

	const updateUserRating = () => {
		if (device.rate && device.rate.length > 0) {
			//console.log(device.rate,'device rate data');
			if (device.rate.find((rate) => rate.userId === user.user.userId))
				setUserRating(
					device.rate.find((rate) => rate.userId === user.user.userId).rate
				);
			if (device.rate.filter((rate) => rate.rate > 0).length > 0)
				setUserRating(
					parseFloat(
						device.rate
							.filter((rate) => rate.rate > 0)
							.reduce((prev, rate) => prev + Number(rate.rate), 0) /
							device.rate.filter((rate) => rate.rate > 0).length
					).toFixed(1)
				);
		}
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
		basketRef.current = { ...basketRef.current, basketId: userBasket?.id };
	}, [userBasket]);

	useEffect(()=>{
		updateUserRating();
	}, [device])


	useEffect(() => {
		fetchOneDevice(id).then((data) => {
			setDevice(data);
			setBrand(dev.brands.find((brand) => brand.id === data.brandId));
			if (user.isAuth) {
				if (data.rate.find(rate=> rate.userId === user.user.userId)) {
					setRating(data.rate.find((rate) => rate.userId === user.user.userId).rate);
				}
			}
			basketRef.current = { ...basketRef.current, device: data };
			// setTimeout(()=>
			// setBrand(dev.brands.find((brand) => brand.id === data.brandId)),1);
		});
		return async () => {
			const { basketId, count, device } = basketRef.current;
			if (count > 0) {
				basket.updateBasketDevice(user.user.userId, Number(id), count);
				await updateBasketDevice(id, basketId, count);
			}
			if (device && device.rating) {
				console.log(device, 'new device');
				await updateDevice(device);
			}
		};
	}, []);

	return (
		<Container className="mt-3">
			<svg width="0" height="0" viewBox="0 0 150 64">
				<defs>
					<clipPath id="cut-off-rating">
						<rect
							fill="#FFFFFF"
							x="0"
							y="0"
							width={rating * 30}
							height="64"
						/>
					</clipPath>
				</defs>
			</svg>
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
							{userRating || 0}
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
							<div className="d-flex flex-column align-items-center my-2">
								<Form.Label className="fs-4">Количество</Form.Label>
								<Form.Control
									className="m-2 w-auto"
									placeholder="Введите количество товара"
									value={deviceCount || 1}
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
						<Figure
							className="d-flex flex-column align-items-center "
							style={{
								marginTop: 25,
								maxWidth: 150,
								cursor: user.isAuth ? 'pointer' : 'not-allowed',
							}}
							onClick={(e) => updateDeviceRating(e)}
						>
							<Figure.Image
								width={150}
								height={64}
								style={{ position: 'absolute' }}
								src={ratingEmpty}
							/>
							<Figure.Image
								width={150}
								height={64}
								style={{
									position: 'absolute',
									clipPath: 'url(#cut-off-rating)',
								}}
								src={ratingFull}
							/>
						</Figure>
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
