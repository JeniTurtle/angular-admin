import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Tooltip
} from '../../components';

import styles from './Toggle.scss';

export default class Toggle extends Component {

	static get defaultProps() {
		return {
			enable: false
		};
	}

	static propTypes = {
		enable: PropTypes.bool
	}

	render() {

		const {
			enable,
			...attrs
		} = this.props;

		return (
			<div className={ styles.wrapper + ' ' + (enable ? styles.enable : styles.disable) } {...attrs}>
				<div></div>
			</div>
		);

	}

}
