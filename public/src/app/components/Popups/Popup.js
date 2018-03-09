import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	connect
} from 'react-redux';
import {
	bindActionCreators
} from 'redux';
import styles from './Popups.scss';
import * as popupActions from '../../actions/Popups';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

@connect(state => state.get('popups').toObject(), dispatch => bindActionCreators(popupActions, dispatch))

export default class Toast extends Component {

	static get defaultProps() {
		return {
			popup: '',
			popupTitle: '',
			popupHeight: 200
		};
	}

	static propTypes = {
		popup: PropTypes.string,
		popupTitle: PropTypes.string,
		popupHeight: PropTypes.number
	}

	close = () => {
		const {
			update
		} = this.props;
		update({
			popup: '',
			popupTitle: ''
		});
	}

	render() {

		const {
			popup,
			popupTitle,
			popupHeight
		} = this.props;

		return (
			<Modal show={ !!popup } className={ styles.popup } onHide={ this.close }>
				<Modal.Header closeButton>
					<Modal.Title>{ popupTitle }</Modal.Title>
				</Modal.Header>
				<Modal.Body dangerouslySetInnerHTML={ {__html: popup} } style={ { height: popupHeight || 'auto' } }>
				</Modal.Body>
				<Modal.Footer>
					<Button className="ok" onClick={ this.close }>知道了</Button>
				</Modal.Footer>
			</Modal>
		);
	}

}
