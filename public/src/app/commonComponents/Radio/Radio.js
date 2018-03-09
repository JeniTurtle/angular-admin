/**
 * Created by waka on 2017/3/31.
 */
// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './Radio.scss';

/**
 * 单选按钮组件
 */
export default class Radio extends Component {

	// 定义属性类型
	static propTypes = {
		isChecked: PropTypes.bool,	// 是否被选中
		text: PropTypes.string,	// 单选项附加文本
		onRadioClick: PropTypes.func,	// 单选项点击事件
		index: PropTypes.number,	// index，多个时用来确认是第几个
	};

	// 设置默认属性
	static defaultProps = {
		isChecked: false,
		text: 'radio',
		onRadioClick: null,
		index: 0
	};

	render() {
		return (
			<section className={styles.radio}>
				{/* 单选项icon CSS画出 */}
				<div className={this.props.isChecked ? styles.iconChecked : styles.iconUnchecked}
					 onClick={() => {
						 if (this.props.onRadioClick) {
							 this.props.onRadioClick(this.props.index);
						 }
					 }}>
					<div className={styles.outer}>
						<div className={styles.inner}/>
					</div>
				</div>
				{/* 单选项文本 */}
				{this.props.text
					? <div className={styles.text}>
						{this.props.text}
					</div>
					: null
				}
			</section>
		);
	}
};
