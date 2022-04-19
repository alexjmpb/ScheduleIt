import React, { Children, useEffect, useState } from 'react'
import { ReactComponent as CloseIcon } from '../../svg/close-icon.svg'
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
	
	const propsChildren = children.map((child) => {
		return React.cloneElement(child, {handleClose: handleClose, open: open})
	})

	useEffect(() => {
		document.body.appendChild(element);
		return () => {
			document.body.removeChild(element);
		}
	}, []);

	return (
		open
		?
		ReactDOM.createPortal(
			<div className="modal">
				<div className='modal__box'>
					{propsChildren}
				</div>
			</div>,
			element
		)
		:
		null
	)
}

export const ModalHeader = ({ children, handleClose, onClick }) => {
	return (
		<div className="modal__header">
			{children}
			<CloseIcon onClick={handleClose} className="modal__close"/>
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