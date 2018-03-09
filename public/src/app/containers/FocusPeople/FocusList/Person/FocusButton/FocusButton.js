/**
 * Created by waka on 2017/3/30.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// 引入样式
import styles from './FocusButton.scss';

/**
 * 关注按钮
 */
export default class FocusButton extends Component {

	// 定义属性类型
	static propTypes = {
		isAlreadyFocus: PropTypes.bool,	// 是否已经关注
	};

	// 设置默认属性
	static defaultProps = {
		isAlreadyFocus: true
	};

	render() {
		return (
			<section
				className={this.props.isAlreadyFocus
					? styles.focusButtonAlready
					: styles.focusButton}>
				<div className={styles.text}>
					{this.props.isAlreadyFocus
						? '已关注'
						: '＋关注'
					}
				</div>
			</section>
		);
	}
}
