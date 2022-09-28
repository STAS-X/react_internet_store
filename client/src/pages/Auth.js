import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '..';
import { login, registration } from '../components/http/userAPI';
import { REGISTRATION_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from '../utils/consts';

const Auth = observer(() => {
	const location = useLocation();
	const navigate = useNavigate();

	const isLogin = location.pathname === '/login';
	const { user } = useContext(Context);

	const [auth, setAuth] = useState('');

	const changeHandler = ({ target }) => {
		setAuth((prevAuth) => {
			return { ...prevAuth, [target.name]: target.value };
		});
	};

	const signIn = async () => {
		let response;
		const { email, password } = auth;

		try {
			if (isLogin) {
				response = await login(email, password);
				user.setIsAuth(true);
				user.setUser({
					userId: response.id,
					role: response.role,
					email: response.email,
				});
				navigate(
					location.state && location.state.nextPathname
						? location.state.nextPathname
						: SHOP_ROUTE
				);
			} else {
				response = await registration(email, password);
			}
		} catch (e) {}
	};
	return (
		<Container
			className="d-flex justify-content-center align-items-center"
			style={{ height: window.innerHeight - 54 }}
		>
			<Card style={{ width: 600 }} className="p-5">
				<h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
				<Form className="d-flex flex-column">
					<Form.Control
						name="email"
						className="mt-3"
						value={auth.email ? auth.email : ''}
						onChange={changeHandler}
						placeholder="Введите email..."
					/>
					<Form.Control
						name="password"
						className="mt-3"
						value={auth.password ? auth.password : ''}
						onChange={changeHandler}
						placeholder="Введите пароль..."
						type="password"
					/>
					<div className="d-flex justify-content-between mt-3 pr-3">
						{isLogin ? (
							<div className="w-auto">
								Нет аккаунта?{' '}
								<NavLink to={REGISTRATION_ROUTE}>Зарегистрируйтесь!</NavLink>
							</div>
						) : (
							<div className="w-auto">
								Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
							</div>
						)}
						<Button
							className="w-auto"
							variant="outline-success"
							onClick={() => signIn()}
						>
							{isLogin ? 'Войти' : 'Зарегистрироваться'}
						</Button>
					</div>
				</Form>
			</Card>
		</Container>
	);
});
export default Auth;
