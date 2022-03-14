import React, { Children, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

const ModalBox = ({ children, className='modal-parent', open=false, handleClose }) => {
	const [element, setElement] = useState(() => {
		const el = document.createElement('div');
		el.className = className;
		el.addEventListener('click', (e) => {
			e.target.className.split(' ').map((class_name) => {
				if (class_name === 'modal') handleClose();
			})
		})
		return el;
	});

	useEffect(() => {
		document.body.appendChild(element);
		return () => {
			document.body.removeChild(element);
		}
	}, []);

	console.log(children)
	
	return (
		open
		?
		ReactDOM.createPortal(
			<div className="modal">
				<div className='modal__box'>
					{children}
				</div>
			</div>,
			element
		)
		:
		null
	)
}

export const ModalHeader = ({ children }) => {
	return (
		<div className="modal__header">
			{children}
		</div>
	)
}

export const ModalBody = ({ children }) => {
	return (
		<div className="modal__body">
			{children}
		</div>
	)
}

export const ModalFooter = ({ children }) => {
	return (
		<div className="modal__footer">
			{children}
		</div>
	)
}

export default ModalBox