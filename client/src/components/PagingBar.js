import React, { useState, useEffect, useMemo } from 'react';
import { Pagination } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { BASKET_ROUTE } from '../utils/consts';

const PagingBar = ({ activePage, setPage, perPage, perSegment, count }) => {
	const [numPages] = useState(
		useMemo(
			() => (Math.ceil(count / perPage) < 1 ? 1 : Math.ceil(count / perPage)),
			[count, perPage]
		)
	);
	const [numSegments] = useState(
		useMemo(
			() =>
				Math.ceil(numPages / perSegment) < 1
					? 1
					: Math.ceil(numPages / perSegment),
			[numPages]
		)
	);

	const [curSegment, setCurSegment] = useState(1);
	const [pages, setPages] = useState([]);
	const { pathname } = useLocation();

	const handlePrevPage = () => {
		if (activePage > 1) setPage(activePage - 1);
	};
	const handleNextPage = () => {
		if (activePage < numPages) setPage(activePage + 1);
	};
	const handleChangePage = (page) => {
		if (activePage !== page) setPage(page);
	};

	// useEffect(() => {
	// 	setNumPages(
	// 		Math.ceil(count / perPage) < 1 ? 1 : Math.ceil(count / perPage)
	// 	);
	// }, [count, perPage]);

	// useEffect(() => {
	// 	setNumSegments(Math.ceil(numPages/perSegment) < 1 ? 1 : Math.ceil(numPages/perSegment));
	// }, [numPages]);

	useEffect(() => {
		setPages(
			Array.from(
				Array(
					curSegment * perSegment <= numPages
						? perSegment
						: perSegment - (curSegment * perSegment - numPages)
				),
				(_, x) => (curSegment - 1) * perSegment + x + 1
			)
		);
	}, [curSegment, numPages]);

	useEffect(() => {
		setCurSegment(
			Math.ceil(activePage / perSegment) < 1
				? 1
				: Math.ceil(activePage / perSegment)
		);
	}, [activePage]);

	return (
		<div
			className="position-absolute"
			style={{
				top: '60%',
				left:
					pathname === '/order'
						? '40%'
						: pathname === '/basket'
						? '30%'
						: '25%',
			}}
		>
			<Pagination size="lg">
				<Pagination.First
					disabled={curSegment === 1}
					onClick={(e) => handleChangePage(1)}
				/>
				<Pagination.Prev disabled={activePage === 1} onClick={handlePrevPage} />
				{pages.map((page) => (
					<Pagination.Item
						key={page}
						active={activePage === page}
						onClick={(e) => handleChangePage(page)}
					>
						{page}
					</Pagination.Item>
				))}
				<Pagination.Next
					disabled={activePage === numPages}
					onClick={handleNextPage}
				/>
				<Pagination.Last
					disabled={curSegment === numSegments}
					onClick={(e) => handleChangePage(numPages)}
				/>
				<Pagination.Item disabled>{`«${(activePage - 1) * perPage + 1} - ${
					activePage * perPage <= count ? activePage * perPage : count
				}» из ${count}`}</Pagination.Item>
			</Pagination>
		</div>
	);
};
export default PagingBar;
