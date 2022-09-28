import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../..';

function useAuth() {
	const { user } = useContext(Context);
	return { isUserAuth: user.isAuth };
}

const $host = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

const $authHost = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

const authInterceptor = (config) => {
	config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
	return config;
};

$authHost.interceptors.request.use(authInterceptor);

const IsAuth = observer(() => {
	const { isUserAuth } = useAuth();

	useEffect(() => {
        const hostInterceptor = (config) => {
            if (isUserAuth) config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
            return config;
		};

		if (isUserAuth && $host.interceptors.request.handlers.length===0) {
			$host.interceptors.request.use(hostInterceptor);
		} else {
            $host.interceptors.request.handlers=[]
        }

	}, [isUserAuth]);

	return;
});

export { $host, $authHost, IsAuth };
