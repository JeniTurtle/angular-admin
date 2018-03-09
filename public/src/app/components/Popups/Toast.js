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
import Loading from '../Loading/Loading';
import styles from './Popups.scss';
import * as popupActions from '../../actions/Popups';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';


let toastTimeout = null;
const defaultDuration = 1500;

@connect(state => state.get('popups').toObject(), dispatch => bindActionCreators(popupActions, dispatch))

export default class Toast extends Component {

	static get defaultProps() {
		return {
			toast: '',
			toastType: 'success',
			toastDuration: 0
		};
	}

	static propTypes = {
		toast: PropTypes.string,
		type: PropTypes.string,
		toastDuration: PropTypes.number
	}

	shouldComponentUpdate(nextProps) {

		const {
			showToast,
			toast
		} = this.props;

		const {
			toastDuration
		} = nextProps;

		if (nextProps.toast) {

			if (toastTimeout) {
				clearTimeout(toastTimeout);
				toastTimeout = null;
			}

			if (toastDuration >= 0) {
				toastTimeout = setTimeout(function() {
					showToast('');
				}, toastDuration || defaultDuration);
			}

		}

		return true;

	}

	render() {

		const {
			toast,
			toastType
		} = this.props;

		return (
			<div className={ styles.toast } style={{ display: toast ? 'block' : 'none' }} >
				{ toastType == 'loading' ?  <Loading /> : <p>{ toastType == 'fail' ? <Glyphicon glyph="info-sign" style={ { fontSize: '16px', color: '#ff3b30' } } /> : <Glyphicon glyph="ok-sign" style={ { fontSize: '16px', color: '#44DB5E' } } /> }{ toast }</p>}
			</div>
		);
	}

}
