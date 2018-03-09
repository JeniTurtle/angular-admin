/**
 * Created by waka on 2017/4/6.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './FormItem.scss';

import {
	DatePicker,
	Input
} from '../../../commonComponents'

/**
 * FormItem 表单项
 */
export default class FormItem extends Component {

	// 定义属性类型
	static propTypes = {
		label: PropTypes.string,	// 标签
		isMust: PropTypes.bool,	// 是否必填
		type: PropTypes.string,	// 类型
	};

	// 设置默认属性
	static defaultProps = {
		label: '',
		isMust: false,
		type: 'input',
	};

	constructor(props) {
		super(props);
	}

	// 渲染右侧部分
	renderRight() {
		// 根据传入的类型判断
		switch (this.props.type) {
			case 'input':
				return <Input/>;
			// 日期
			case 'date':
				return <div className={styles.date}>
					<div className={styles.dateItem}>
						<DatePicker text="年"/>
					</div>
					<div className={styles.dateItem}>
						<DatePicker text="月"/>
					</div>
				</div>;
			default:
				return null;
		}
	}

	render() {
		return (
			<section className={styles.wrapper}>

				{/* 左侧 */}
				<div className={styles.left}>
					{/* 是否必填 */}
					{this.props.isMust
						? <span className={styles.isMust}>*</span>
						: null
					}
					{/* label 标签 */}
					<span className={styles.label}>{this.props.label}</span>
				</div>

				{/* 右边 */}
				<div className={styles.right}>
					{this.props.children}
				</div>
			</section>
		);
	}
};
