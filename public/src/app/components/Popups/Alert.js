import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import styles from './Popups.scss';

export default class Alert extends Component {

	render() {

		const {
			title,
			children,
			closeText,
			show,
			onClose,
			onDone
		} = this.props;

		return (
			<Modal show={ show } onHide={ onClose } className={ styles.alert }>
				{ title.length > 0 &&
					<Modal.Header closeButton>
						<Modal.Title>{ title }</Modal.Title>
					</Modal.Header>
				}
				<Modal.Body>
					<p>{ children }</p>
				</Modal.Body>
				<Modal.Footer>
				<Button onClick={ onDone }>{ closeText || '关闭' }</Button>
				</Modal.Footer>
			</Modal>
		);
	}

}
