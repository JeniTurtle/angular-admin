import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import styles from './Popups.scss';

export default class Confirm extends Component {

	render() {

		const {
			title,
			content,
			closeText,
			okText,
			onX,
			show,
			onClose,
			height,
			onOK,
			closeIsText
		} = this.props;

		return (
			<Modal className={ styles.confirm } show={ show } onHide={ onX || onClose }>
				<Modal.Header closeButton>
					<Modal.Title>{ title }</Modal.Title>
				</Modal.Header>
				<Modal.Body dangerouslySetInnerHTML={ {__html: content} } style={ { height: height || 'auto' } }></Modal.Body>
				<Modal.Footer>
				{ !closeIsText && <Button onClick={ onClose } className="cancel">{ closeText || '取消' }</Button> }
				{ closeIsText && <p onClick={ onClose } className="cancel">{ closeText || '取消' }</p> }
				<Button className="ok" onClick={ onOK }>{ okText || '确定' }</Button>
				</Modal.Footer>
			</Modal>
		);
	}

}
