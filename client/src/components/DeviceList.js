import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { Context } from '..';
import DeviceItem from './DeviceItem';

const DeviceList = observer(() => {
	const { device, user } = useContext(Context);

	const clearFilters = () => {
		device.setSelectedBrand({});
		device.setSelectedType({});
	};

	return (
		<Row className="d-flex">
			{device.devices.length > 0 &&
				device.devices.map((dev) => (
					<DeviceItem
						key={dev.id}
						device={dev}
						brand={device.brands.find((brand) => brand.id === dev.brandId)}
					/>
				))}
			{device.devices.length === 0 && user.isAuth && (
				<div className="mx-1 my-4">
					<h4>Товары не найдены!</h4>
					<Button
						variant="outline-dark"
						className="mt-3"
						onClick={clearFilters}
					>
						Очистить фильтр
					</Button>
				</div>
			)}
		</Row>
	);
});
export default DeviceList;
