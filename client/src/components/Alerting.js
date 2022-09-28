import React, { useEffect, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';

const AlertingMessage = ({
	show,
	setShow,
	type,
	headText,
	messageText,
}) => {

    const alertRef = useRef();

	useEffect(() => {
		const id = setTimeout(() => setShow(false), 5000);
		return () => {
			clearTimeout(id);
		};
	}, [show]);

	useEffect(() => {
		if (show && alertRef.current) {
            alertRef.current.style.top = `${parseInt(150 - alertRef.current?.getBoundingClientRect().top)}px`;
        }
	}, [show, alertRef]);

	if (show) {
		return (
			<Alert
				ref={alertRef}
				variant={type ? type : 'success'}
				style={{ maxWidth: '80%', margin: '0 auto' }}
				closeLabel={'Закрыть'}
				onClose={() => setShow(false)}
				dismissible
			>
				<Alert.Heading>{headText}</Alert.Heading>
				<p>{messageText}</p>
			</Alert>
		);
	}
	//return;
};

// Specifies the default values for props:
AlertingMessage.defaultProps = {
	type:'success',
	headText : 'Всплывающее сообщение',
	messageText : 'Пример всплывающего сообщения',

};

export default AlertingMessage;
