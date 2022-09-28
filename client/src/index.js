import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DeviceStore from './store/DeviceStore';
import UserStore from './store/UserStore';
import BasketStore from './store/BasketStore';
import OrderStore from './store/OrderStore';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Context.Provider value={{ user: new UserStore(), basket: new BasketStore(), device: new DeviceStore(), order: new OrderStore()}}>
			<App />
		</Context.Provider>
	</React.StrictMode>
);
