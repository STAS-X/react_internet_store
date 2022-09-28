import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Card, Row } from 'react-bootstrap';
import { Context } from '..';
    
const BrandBar = observer(() => {
    const {device} = useContext(Context);
    const selectedId = device.selectedBrand?.id?device.selectedBrand.id:0;
    return (
			<Row className="d-flex">
				{device.brands.map((brand) => (
					<Card
						as="button"
						key={brand.id}
						className="p-3 m-1 w-auto"
						bg={selectedId === brand.id ? 'light' : 'muted'}
						border={selectedId === brand.id ? 'success' : 'light'}
						onClick={() => device.setSelectedBrand(brand)}
					>
						{brand.name}
					</Card>
				))}
			</Row>
		);
});
export default BrandBar;