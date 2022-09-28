import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Dropdown, Form, Modal, Row } from 'react-bootstrap';
import { Context } from '../..';
import AlertingMessage from '../Alerting';
import { createDevice, updateDevice, fetchOneDevice } from '../http/deviceApi';

const CreateDevice = observer(({ show, deviceId, setDevice, onHide }) => {
	const { device } = useContext(Context);

	const [info, setInfo] = useState([]);
	const [deviceData, setDeviceData] = useState({});

	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState('');
	const [headAlert, setHeadAlert] = useState('');
	const [messageAlert, setMessageAlert] = useState('');

	const addInfo = () => {
		setInfo([...info, { title: '', description: '', id: Date.now() }]);
	};

	const changeInfo = ({ target }, id) => {
		const newInfo = info.map((i) => {
			if (i.id !== id) return i;
			return { ...i, [target.name]: target.value };
		});
		setInfo(newInfo);
		setDeviceData((prevData) => {
			return {
				...prevData,
				info: JSON.stringify(newInfo),
			};
		});
	};

	const changeHandler = ({ target }) => {
		if (target.name !== 'img') {
			let value = target.value;
			if (
				(target.name === 'rating' || target.name === 'price') &&
				(isNaN(value) || Number(value) < 0)
			)
				value = 0;
			if (target.name === 'rating' && value > 10) value = 10;

			setDeviceData((prevData) => {
				return {
					...prevData,
					[target.name]: value || target.getAttribute('id') || '',
				};
			});
		} else {
			const image = target.files[0];
			const fileReader = new FileReader();

			fileReader.onload = (e) => {
				if (!e || !fileReader.result) return;
				const blob = new Blob([new Uint8Array(fileReader.result)], {
					type: image.type,
				});
				blob.name = image.name;
				setDeviceData((prevData) => {
					return {
						...prevData,
						[target.name]: blob,
					};
				});
			};

			fileReader.readAsArrayBuffer(image);
		}
	};

	const addDevice = async () => {
		createDevice(deviceData)
			.then((data) => {
				setDeviceData({});
				setInfo([]);
				onHide();
				// Показываем всплывающую подсказку, если добавление устройства прошло успешно
				setHeadAlert('Сообщение о добавлении');
				setMessageAlert(
					`Добавление устройства '${data.name} [id - ${data.id}]' прошло успешно`
				);
				setTypeAlert('success');
				setShowAlert(true);
			})
			.catch((error) => {
				// Показываем всплывающую подсказку, при возникновении ошибки
				setHeadAlert('Сообщение об ошибке');
				setMessageAlert(`При обнолении возникла ошибка: ${error.message}`);
				setTypeAlert('danger');
				setShowAlert(true);
			});
	};

	const editDevice = async () => {
		updateDevice(deviceData)
			.then((data) => {
				device.setDevices(
					device.devices.map((dev) => {
						return dev.id !== data.id ? dev : data;
					})
				);
				setDevice(data);
				//setDeviceData({});
				//setInfo([]);
				onHide();
				// Показываем всплывающую подсказку, если обновление прошло успешно
				setHeadAlert('Сообщение об обновлении');
				setMessageAlert(
					`Обновление данных устройства '${data.name} [id - ${data.id}]' прошло успешно`
				);
				setTypeAlert('success');
				setTimeout(() => setShowAlert(true), 100);
			})
			.catch((error) => {
				onHide();
				// Показываем всплывающую подсказку, при возникновении ошибки
				setHeadAlert('Сообщение об ошибке');
				setMessageAlert(`При обнолении возникла ошибка: ${error.message}`);
				setTypeAlert('danger');
				setTimeout(()=>setShowAlert(true),100);
			});
	};

	useEffect(() => {
		if (deviceId)
			fetchOneDevice(deviceId).then((data) => {
				setDeviceData({ ...data, info: JSON.stringify(data.info) });
				setInfo(data.info);
				// setTimeout(()=>
				// setBrand(dev.brands.find((brand) => brand.id === data.brandId)),1);
			});
	}, []);

	return (
		<>
			<AlertingMessage
				show={showAlert}
				setShow={setShowAlert}
				type={typeAlert}
				headText={headAlert}
				messageText={messageAlert}
			/>
			<Modal
				show={show}
				onHide={onHide}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Добавить устройство
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/*<Form>
					<Form.Control placeholder="Введите название устройства" />
				</Form>*/}
					<Form id="createDevice">
						<Col className="d-flex flex-row gap-3">
							<Dropdown>
								<Dropdown.Toggle>
									{deviceData.typeId 
										? device.types.find(
												type => type.id === Number(deviceData.typeId)
										  )?.name
										: 'Выберите тип'}
								</Dropdown.Toggle>
								<Dropdown.Menu onClick={changeHandler}>
									{device.types.map((type) => (
										<Dropdown.Item name="typeId" id={type.id} key={type.id}>
											{type.name}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
							<Dropdown>
								<Dropdown.Toggle>
									{deviceData.brandId 
										? device.brands.find(
												brand => brand.id === Number(deviceData.brandId)
										  )?.name
										: 'Выберите брэнд'}
								</Dropdown.Toggle>
								<Dropdown.Menu onClick={changeHandler}>
									{device.brands.map((brand) => (
										<Dropdown.Item name="brandId" id={brand.id} key={brand.id}>
											{brand.name}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
						</Col>
						<Form.Control
							name="name"
							value={deviceData.name || ''}
							onChange={changeHandler}
							className="mt-3"
							placeholder="Введите название устройства"
						/>
						<Form.Control
							name="price"
							value={deviceData.price || ''}
							onChange={changeHandler}
							className="mt-3"
							placeholder="Введите стоимость устройства"
							type="number"
							min="0"
						/>
						<Form.Control
							name="rating"
							value={deviceData.rating || ''}
							onChange={changeHandler}
							className="mt-3"
							placeholder="Введите рейтинг устройства"
							type="number"
							min="0"
							max="10"
						/>
						<Form.Control
							name="img"
							onChange={changeHandler}
							className="mt-3"
							placeholder="Добавьте изображение"
							type="file"
							accept="image/jpeg, image/tif, image/bmp, image/png"
						/>
						<hr />
						<Button variant="outline-dark" onClick={addInfo}>
							Добавить новое свойство
						</Button>
						{info.length > 0 &&
							info.map((i) => (
								<Row key={i.id} className="mt-3">
									<Col md={4}>
										<Form.Control
											name="title"
											value={
												info.find((detail) => detail.id === i.id)?.title || ''
											}
											onChange={(e) => changeInfo(e, i.id)}
											placeholder="Название характеристики"
										></Form.Control>
									</Col>
									<Col md={4}>
										<Form.Control
											name="description"
											value={
												info.find((detail) => detail.id === i.id)
													?.description || ''
											}
											onChange={(e) => changeInfo(e, i.id)}
											placeholder="Описание характеристики"
										></Form.Control>
									</Col>
									<Col md={4}>
										<Button
											variant="outline-success"
											onClick={() =>
												setInfo(info.filter((info) => i.id !== info.id))
											}
										>
											Удалить
										</Button>
									</Col>
								</Row>
							))}
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="outline-success"
						onClick={() => {
							if (deviceId) {
								editDevice();
							} else {
								addDevice();
							}
						}}
					>
						{deviceId ? 'Изменить' : 'Добавить'}
					</Button>
					<Button variant="outline-danger" onClick={onHide}>
						Закрыть
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
});
export default CreateDevice;
