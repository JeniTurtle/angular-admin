/**
 * Created by BadWaka on 2017/4/24.
 */

/********************************** React ****************************************/

import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// 引入样式
import styles from './InputRow.scss';

/**
 * 输入行，主要是为了复用
 */
export default class InputRow extends Component {

	// 定义属性类型
	static propTypes = {
		type: PropTypes.string,	// input 类型
		verifyStatus: PropTypes.number,	// 验证状态: -1失败; 0默认; 1成功
		verifyTips: PropTypes.string,	// 验证提示信息
		value: PropTypes.string,	// value
		placeholder: PropTypes.string,	// placeholder
		onChange: PropTypes.func,	// 监听input变化
		onFocus: PropTypes.func,	// 获得焦点
		onBlur: PropTypes.func,	// 失去焦点
	};

	// 设置默认属性
	static defaultProps = {
		type: 'text',
		verifyStatus: 0,
		verifyTips: '',
		value: '',
		placeholder: '',
		onChange: null,
		onFocus: null,
		onBlur: null,
	};

	constructor(props) {
		super(props);
		this.state = {
			value: props.value,	// 值
			isFocus: false,	// 是否获得焦点
		}
	}

	handleInputFocus(e) {
		// console.log('handleInputFocus');
		this.setState(() => {
			return {
				isFocus: true
			};
		});
		if (this.props.onFocus) {
			this.props.onFocus();
		}
	}

	handleInputBlur(e) {
		// console.log('handleInputBlur');
		this.setState(() => {
			return {
				isFocus: false
			};
		});
		if (this.props.onBlur) {
			this.props.onBlur();
		}
	}

	handleChange(e) {
		const value = e.target.value;
		this.setState(() => {
			return {
				value
			};
		});
		if (this.props.onChange) {
			this.props.onChange(value);
		}
	}

	render() {
		return (
			<section className={styles.wrapper}>
				<div className={styles.row}>

					{/* 输入框 */}
					<input
						className={styles.input}
						type={this.props.type}
						value={this.state.value}
						placeholder={this.props.placeholder}
						onChange={this.handleChange.bind(this)}
						onFocus={this.handleInputFocus.bind(this)}
						onBlur={this.handleInputBlur.bind(this)}/>

					{/* 正确标识 */}
					{this.props.verifyStatus === 1
						? <span
							className="iconfont icon-complete"
							style={{
								position: 'absolute',
								right: '0px',
								color: '#44DB5E',
								fontSize: '24px'
							}}/>
						: null
					}

					{/* 错误标识 */}
					{this.props.verifyStatus === -1
						? <span
							className="iconfont icon-over"
							style={{
								position: 'absolute',
								right: '0px',
								color: '#FF3B30',
								fontSize: '24px'
							}}/>
						: null
					}
				</div>
				<div
					className={this.state.isFocus
						? styles.hrActive
						: styles.hr
					}>
					{/* 错误提示 */}
					{this.props.verifyTips
						? <p className={styles.errorTips}>{this.props.verifyTips}</p>
						: null
					}
				</div>
			</section>
		);
	}
}
