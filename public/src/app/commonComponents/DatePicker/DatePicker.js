/**
 * Created by waka on 2017/4/6.
 */
// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './DatePicker.scss';

// 导入图标
import arrowDownIcon from './arrow-down.svg';

/**
 * 按钮组件
 */
export default class DatePicker extends Component {

	// 定义属性类型
	static propTypes = {
		value: PropTypes.string,	// 值
		type: PropTypes.string,	// 类型；包括年、月
		minYear: PropTypes.number,	// 最小年份
		maxYear: PropTypes.number,	// 最大年份
		text: PropTypes.string,	// 文本
		onChange: PropTypes.func,	// 监听变化
	};

	// 设置默认属性
	static defaultProps = {
		value: '',
		type: 'year',
		minYear: 2000,
		maxYear: new Date().getFullYear(),
		text: '年',
		onChange: null,
	};

	constructor() {
		super();

		this.state = {
			value: '',	// 值
			isSelected: false,	// 是否被选中
		}
	}

	componentWillMount() {
		if (this.props.value && !this.state.value) {
			this.setState(() => {
				return {
					value: this.props.value
				}
			})
		}
	}

	/**
	 * 根据类型渲染select
	 *
	 * @return {XML}
	 */
	renderSelectByType() {

		const type = this.props.type;

		switch (type) {
			case 'year':

				let years = [];
				for (let i = 0; i < this.props.maxYear - this.props.minYear + 1; i++) {
					years.push(this.props.minYear + i);
				}

				return <div
					className={styles.select}
					style={{
						display: this.state.isSelected ? 'block' : 'none'
					}}>
					{years.map((year, index) => {
						return <div
							key={index}
							className={styles.option}
							onClick={() => {
								if (this.props.onChange) {
									this.props.onChange(year);
								}
								this.setState(() => {
									return {
										value: year
									}
								});
							}}>
							{year}
						</div>;
					})}
				</div>;
			case 'month':

				let months = [];
				for (let i = 1; i <= 12; i++) {
					months.push(i);
				}

				return <div
					className={styles.select}
					style={{
						display: this.state.isSelected ? 'block' : 'none'
					}}>
					{months.map((month, index) => {
						return <div
							key={index}
							className={styles.option}
							onClick={() => {
								if (this.props.onChange) {
									this.props.onChange(month);
								}
								this.setState(() => {
									return {
										value: month
									}
								});
							}}>
							{month}
						</div>;
					})}
				</div>;
			default:
				return null;
		}
	}

	render() {

		return (
			<section
				className={styles.datePicker}
				onClick={() => {
					this.setState(() => {
						return {
							isSelected: !this.state.isSelected
						}
					})
				}}>
				<span className={styles.year}>{this.state.value}{this.props.text}</span>
				<img
					className={styles.arrow}
					src={arrowDownIcon}
					style={{
						transform: this.state.isSelected ? 'rotate(180deg)' : 'rotate(0deg)'
					}}/>
				{/* 根据type渲染select */}
				{this.renderSelectByType()}
			</section>
		);
	}
};
