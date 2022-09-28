import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Context } from '..';
import { authRoutes, publicRoutes } from '../routes';
import { SHOP_ROUTE } from '../utils/consts';

const AppRouter = observer(() => {
	const { user } = useContext(Context);

	return (
		<Routes>
			{user.isAuth && authRoutes.map(({ path, component, exact = false }) => (
				<Route key={path} path={path} element={component} exact={exact} />
			))}
			{publicRoutes.map(({ path, component, exact = false }) => (
				<Route
					key={path}
					path={path}
					element={component}
					exact={exact}
				/>
			))}
			<Route
				path="*"
				element={<Navigate to={SHOP_ROUTE} replace />}
			></Route>
		</Routes>
	);
});
export default AppRouter;
