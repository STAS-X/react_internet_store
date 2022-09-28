import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import CreateBrand from '../components/modals/CreateBrand';
import CreateDevice from '../components/modals/CreateDevice';
import CreateType from '../components/modals/CreateType';

const Admin = () => {
	const [brandShow, setBrandShow] = useState(false);
	const [typeShow, setTypeShow] = useState(false);
	const [deviceShow, setDeviceShow] = useState(false);

	return (
		<>
			<Container className="d-flex flex-row justify-content-between">
				<Button
					variant="outline-dark"
					className="mt-4 p-2"
					onClick={() => setTypeShow(true)}
				>
					Добавить тип
				</Button>
				<Button
					variant="outline-dark"
					className="mt-4 p-2"
					onClick={() => setBrandShow(true)}
				>
					Добавить бренд
				</Button>
				<Button
					variant="outline-dark"
					className="mt-4 p-2"
					onClick={() => setDeviceShow(true)}
				>
					Добавить устройство
				</Button>
			</Container>
			<CreateType show={typeShow} onHide={() => setTypeShow(false)} />
			<CreateBrand show={brandShow} onHide={() => setBrandShow(false)} />
			<CreateDevice show={deviceShow} onHide={() => setDeviceShow(false)} />
		</>
	);
};
export default Admin;
