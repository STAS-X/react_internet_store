import React, { useContext, useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import { NavLink, useLocation } from 'react-router-dom';
import { Context } from '..';
import {
	ADMIN_ROUTE,
	ORDER_ROUTE,
	BASKET_ROUTE,
	LOGIN_ROUTE,
	SHOP_ROUTE,
} from '../utils/consts';
import image_baket from '../assets/baket.png';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const NavBar = observer(() => {
	const { user, basket, device } = useContext(Context);

	const [userBasket, setUserBasket] = useState({});
    const history = useNavigate();
	const location = useLocation();

	useEffect(() => {
		setUserBasket(
			...basket.baskets.filter((basket) => basket.userId === user.user.userId)
		);
	}, [user.user, basket.baskets]);



	return (
		<Navbar bg="light" variant="light">
			<Container style={{ width: '300vh' }}>
				<NavLink style={{ color: 'black', marginLeft: 10 }} to={SHOP_ROUTE}>
					КупиДевайс
				</NavLink>
				{user.isAuth ? (
					<Nav className="ml-auto mt-2">
						<Button
							className="position-relative mx-3"
							variant={1 === 0 ? 'outline-dark' : 'outline-info'}
							onClick={() => history(BASKET_ROUTE)}
						>
							<Image src={image_baket} width="30px" fluid />{' '}
							{userBasket?.devices?.length > 0 && (
								<Badge
									className="position-absolute top-0 start-100 translate-middle rounded-pill border border-2 border-secondary"
									bg="success"
								>
									{userBasket.devices.length}
								</Badge>
							)}
						</Button>
						<Button
							className="mx-1"
							variant="outline-dark"
							onClick={() => history(ORDER_ROUTE)}
						>
							История заказов
						</Button>
						<Button
							className="mx-1"
							variant="outline-dark"
							onClick={() => history(ADMIN_ROUTE)}
						>
							Админ панель
						</Button>
						<Button
							className="mx-1"
							variant="outline-dark"
							onClick={() => {
								user.setIsAuth(false);
								device.setSelectedPage(1);
								history(LOGIN_ROUTE);
							}}
						>
							Выйти
						</Button>
					</Nav>
				) : (
					<Nav className="ml-auto">
						<Button
							className="mx-1"
							variant="outline-dark"
							onClick={() => history(LOGIN_ROUTE, {state:{nextPathname:location.pathname}})}
						>
							Авторизация
						</Button>
					</Nav>
				)}
			</Container>
		</Navbar>
	);
});

export default NavBar;
