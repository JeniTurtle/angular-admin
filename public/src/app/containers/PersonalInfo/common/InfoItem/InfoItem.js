/**
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './InfoItem.scss';

/**
 * 信息标题组件
 */
export default class InfoItem extends Component {

	// 定义属性类型
	static propTypes = {
		title: PropTypes.string,	// 标题
		content: PropTypes.string,	// 内容
		contentColor: PropTypes.string,	// 内容颜色
		btnText: PropTypes.string, 	// 按钮文本
		onRightClick: PropTypes.func,	// 右侧按钮点击事件
	};

	// 设置默认属性
	static defaultProps = {
		title: '',
		content: '',
		contentColor: 'inherit',
		btnText: '',
		onRightClick: null,
	};

	render() {
		return (
			<section className={styles.row}>
				<span className={styles.title}>{this.props.title}</span>
				<span
					className={styles.content}
					style={{
						color: this.props.contentColor
					}}>
					{this.props.content}
				</span>
				{/* 右侧按钮 */}
				{this.props.btnText
					? <span className={styles.btnText}
							onClick={() => {
								if (this.props.onRightClick) {
									this.props.onRightClick();
								}
							}}>
						{this.props.btnText}
						</span>
					: null
				}
			</section>
		);
	}
};
