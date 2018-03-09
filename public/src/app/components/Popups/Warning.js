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
import Alert from 'react-bootstrap/lib/Alert';

import styles from './Popups.scss';
import * as popupActions from '../../actions/Popups';

let warningTimeout = null;
const defaultDuration = 3000;

@connect(state => state.get('popups').toObject(), dispatch => bindActionCreators(popupActions, dispatch))

export default class Warning extends Component {

	static get defaultProps() {
		return {
			warning: '',
			type: 'warning',
			duration: 0
		};
	}

	static propTypes = {
		warning: PropTypes.string,
		type: PropTypes.string,	// one of: "success", "warning", "danger", "info"
		duration: PropTypes.number
	};

	handleDismiss = () => {
		const {
			showWarning
		} = this.props;

		showWarning('');
	};

	shouldComponentUpdate(nextProps) {

		const {
			showWarning,
			warning
		} = this.props;

		const {
			duration
		} = nextProps;

		if (nextProps.warning) {

			if (warningTimeout) {
				clearTimeout(warningTimeout);
				warningTimeout = null;
			}

			if (duration >= 0) {
				warningTimeout = setTimeout(function () {
					showWarning('');
				}, duration || defaultDuration);
			}

		}

		return true;

	}

	render() {

		const {
			warning,
			type
		} = this.props;

		return (
			<Alert
				bsStyle={ type }
				className={ styles.warning }
				style={{display: warning ? 'block' : 'none'}}
				onDismiss={ this.handleDismiss }>
				<h4 dangerouslySetInnerHTML={ {__html: warning} }></h4>
			</Alert>
		);
	}

}
