import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Context } from '..';
import BrandBar from '../components/BrandBar';
import DeviceList from '../components/DeviceList';
import {
	fetchDevices,
} from '../components/http/deviceApi';
import PagingBar from '../components/PagingBar';
import TypeBar from '../components/TypeBar';

const Shop = observer(() => {
	const { device } = useContext(Context);
	const [page, setPage] = useState(device.selectedPage || 1);

	useEffect(() => {
		fetchDevices(
			device.devicesPerPage,
			page,
			device.selectedBrand.id,
			device.selectedType.id
		).then((data) => {
			device.setDevices(data.rows);
			device.setDevicesCount(data.count);
		});
	}, [device.selectedType, device.selectedBrand, page]);

	return (
		<Container className="position-relative min-vh-100">
			<Row className="mt-3">
				<Col md={3}>
					<TypeBar />
				</Col>
				<Col md={9}>
					<BrandBar />
					<DeviceList/>
				</Col>
			</Row>
			{device.devicesCount > 0 && (
				<PagingBar
					activePage={page}
					setPage={setPage}
					perPage={device.devicesPerPage}
					perSegment={device.pagesPerSegment}
					count={device.devicesCount}
				/>
			)}
		</Container>
	);
});
export default Shop;
