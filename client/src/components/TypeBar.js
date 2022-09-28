import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Context } from '..';

const TypeBar = observer(() => {
	const { device } = useContext(Context);
	const selectedId = device.selectedType?.id?device.selectedType.id:0;

	return (
		<ListGroup>
			{device.types.map((type) => (
				<ListGroup.Item
					action
					active={selectedId === type.id}
					onClick={() => device.setSelectedType(type)}
					key={type.id}
				>
					{type.name}
				</ListGroup.Item>
			))}
		</ListGroup>
	);
});
export default TypeBar;
