/**
 * Created by waka on 2017/5/31.
 */

// React
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
// CSS modules
import styles from './Alert.scss';

import successIcon from './success.png';
import errorIcon from './error.png';

/********************************** Redux ****************************************/

import {
	bindActionCreators
} from 'redux';

import {
	connect
} from 'react-redux';

import {	// 弹出层
	showAlert,
} from '../../actions/Popups';

@connect(state => ({
	popups: state.get('popups'),
}), dispatch => bindActionCreators({
	showAlert,
}, dispatch))

/**
 * 警告框组件
 */
export default class Alert extends Component {

	// 定义属性类型
	static propTypes = {};

	// 设置默认属性
	static defaultProps = {};

	render() {

		const {
			popups,
			showAlert,
		} = this.props;

		const alertContent = popups.get('alertContent');	// 获得内容

		// 如果内容存在，显示alert
		if (alertContent) {

			const alertType = popups.get('alertType');	// 获得类型
			const alertDuration = popups.get('alertDuration');	// 获得持续时间

			// 如果持续时间存在
			if (alertDuration) {
				// 持续时间后将alert内容设为空，关闭alert
				setTimeout(() => {
					showAlert('', '', 0);
				}, alertDuration);
			}

			return (
				<section className={styles.alertWrapper}>

					<section className={styles.alert}>

						{/* 成功图标 */}
						{alertType === 'success'
							? <img src={successIcon} alt="success"/>
							: null
						}

						{/* 错误图标 */}
						{alertType === 'error'
							? <img src={errorIcon} alt="error"/>
							: null
						}

						{/* 文字描述 */}
						<span className={styles.text}>{alertContent}</span>

					</section>

				</section>
			);
		}
		// 如果内容不存在，不显示
		else {
			return null;
		}
	}
};
