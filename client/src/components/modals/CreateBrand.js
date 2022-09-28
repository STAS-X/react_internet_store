import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Context } from '../..';
import { createBrand, fetchBrands } from '../http/deviceApi';
import AlertingMessage from '../Alerting';

const CreateBrand = observer(({ show, onHide }) => {
	const { device } = useContext(Context);
	const [value, setValue] = useState('');

	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState('');
	const [headAlert, setHeadAlert] = useState('');
	const [messageAlert, setMessageAlert] = useState('');

	const addBrand = async () => {
		createBrand({ name: value })
			.then((data) => {
				fetchBrands().then((data) => device.setBrands(data));
				setValue('');
				onHide();
				// Показываем всплывающую подсказку, если добавление брэнда прошло успешно
				setHeadAlert('Сообщение о добавлении');
				setMessageAlert(
					`Добавление брэнда '${data.name} [id - ${data.id}]' прошло успешно`
				);
				setTypeAlert('success');
				setShowAlert(true);
			})
			.catch((error) => {
				onHide();
				// Показываем всплывающую подсказку, при возникновении ошибки
				setHeadAlert('Сообщение об ошибке');
				setMessageAlert(`При обнолении возникла ошибка: ${error.message}`);
				setTypeAlert('danger');
				setShowAlert(true);
			});
	};
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
						Добавить брэнд
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Control
							value={value}
							onChange={(e) => setValue(e.target.value)}
							placeholder="Введите название брэнда"
						/>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="outline-success" onClick={() => addBrand()}>
						Добавить
					</Button>
					<Button variant="outline-danger" onClick={onHide}>
						Закрыть
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
});
export default CreateBrand;
