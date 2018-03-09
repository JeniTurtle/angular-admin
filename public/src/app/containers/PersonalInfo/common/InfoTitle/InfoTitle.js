/**
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './InfoTitle.scss';

/**
 * 信息标题组件
 */
export default class InfoTitle extends Component {

	// 定义属性类型
	static propTypes = {
		title: PropTypes.string,	// 标题
		btnText: PropTypes.string, 	// 按钮文本
		onRightClick: PropTypes.func,	// 右侧按钮点击事件
	};

	// 设置默认属性
	static defaultProps = {
		title: '',
		btnText: '',
		onRightClick: null,
	};

	handleButtonClick() {
		if (this.props.onRightClick) {
			this.props.onRightClick();
		}
	}

	render() {
		return (
			<section className={styles.row}>
				<span className={styles.title}>{this.props.title}</span>
				{this.props.btnText
					? <span
						className={styles.btnText}
						onClick={this.handleButtonClick.bind(this)}>
						{this.props.btnText}
						</span>
					: null
				}
			</section>
		);
	}
};
