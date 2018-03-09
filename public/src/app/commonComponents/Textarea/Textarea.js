/**
 * Created by waka on 12/04/2017.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './Textarea.scss';

/**
 * input
 */
export default class Textarea extends Component {

	// 定义属性类型
	static propTypes = {
		value: PropTypes.string,	// 值
		placeholder: PropTypes.string,	// 提示语
		maxWordsCount: PropTypes.number,	// 最大输入字数
		onChange: PropTypes.func,		// 当改变发生
		onError: PropTypes.func,	// 错误回调
		fontSize: PropTypes.number,	// 字体大小
		borderColor: PropTypes.string,	// 边框颜色
		textareaHeight: PropTypes.number,	// 文本框高度
		textareaMaxHeight: PropTypes.number,	// 文本框最大（撑开）高度
		paddingTop: PropTypes.number,	// paddingTop，主要是用来居中微调的
		paddingRight: PropTypes.number,	// 内部textarea距右侧宽度
		wordsCountBottom: PropTypes.number,	// 文字统计距底部的距离，主要是用来居中微调的
	};

	// 设置默认属性
	static defaultProps = {
		value: '',
		placeholder: '',
		onChange: null,
		onError: null,
		fontSize: 14,
		borderColor: '',
		textareaHeight: 40,
		textareaMaxHeight: 120,	// 默认为普通单行的3倍
		paddingTop: 8,
		paddingRight: 60,
		wordsCountBottom: 10,
	};

	constructor(props) {
		super(props);

		// 值是否被手动修改
		this.changed = false;

		// 内部维护状态
		this.state = {
			value: props.value,	// 当前文本域内的值
			curWordsCount: props.value.length,	// 当前input输入字数
			isFocus: false,	// 是否获得焦点
			textareaHeight: props.textareaHeight,	// 文本域高度：默认是40，但是要去掉边框
		}
	}

	componentDidUpdate() {
		// 如果外部传了value 并且 当前state的value为空 并且 值没有被手动修改
		if (this.props.value && !this.state.value && !this.changed) {
			// 将传入的props.value设置为初始state.value
			this.setState(() => {
				return {
					value: this.props.value,
					curWordsCount: this.props.value.length
				};
			});
		}
	}

	handleChange() {

		// 手动改变
		this.changed = true;

		// 更新state
		this.setState(() => {
			return {
				value: this.input.value,
				curWordsCount: this.input.value.length,	// 输入文本长度
			}
		});

		// 字数超过，错误回调
		if (this.input.value.length > this.props.maxWordsCount && this.props.onError) {
			this.props.onError(true);
		} else {
			this.props.onError(false);
		}

		// 调用外部回调
		if (this.props.onChange) {
			this.props.onChange(this.input.value);
		}
	}

	render() {

		let wrapperStyle = {
			height: this.state.textareaHeight + 2 + 'px'
		};
		wrapperStyle.borderColor = this.state.isFocus ? '#0037FF' : '#DBDBDB';
		if (this.props.borderColor) {
			wrapperStyle.borderColor = this.props.borderColor;
		}

		return (
			/* input wrapper2 包裹Input的div，用于减少input边框带来的宽高问题，和方便计数展示组件的绝对定位 */
			<section
				className={styles.wrapper}
				// 根据是否获得焦点来变化外边框颜色样式
				style={wrapperStyle}>

				{/* input */}
				<textarea
					className={styles.textarea}
					style={{
						fontSize: this.props.fontSize,
						height: this.state.textareaHeight + 'px',
						paddingTop: this.props.paddingTop + 'px',
						paddingRight: this.props.maxWordsCount 	// 这里需要判断一下是否传入最大数
							? this.props.paddingRight + 'px' 	// 如果传入，需要给最大数留出位置
							: '10px' 	// 不传入，直接100%
					}}
					value={this.state.value}
					placeholder={this.props.placeholder}
					// 获得真实DOM；因为需要获得input的值，所以需要获得DOM
					ref={(input) => {
						this.input = input;
					}}
					onChange={this.handleChange.bind(this)}

					// 这里监听聚焦和取消聚焦主要是为了控制外边框的样式
					onFocus={() => {
						// console.log('onFocus');
						this.setState((prevState) => {
							return {
								isFocus: true,
								textareaHeight: this.props.textareaMaxHeight
							}
						});
					}}
					onBlur={() => {
						// console.log('onBlur');
						this.setState((prevState) => {
							return {
								isFocus: false,
							}
						});
					}}/>

				{/* input字数 */}
				{this.props.maxWordsCount
					? <span
						className={styles.inputWordsCount}
						style={{
							fontSize: this.props.fontSize,
							bottom: this.props.wordsCountBottom + 'px',
							color: this.state.curWordsCount > this.props.maxWordsCount
								? 'red'
								: '#9B9B9B'
						}}>
						{this.state.curWordsCount + '/' + this.props.maxWordsCount}
					</span>
					: null
				}
			</section>
		);
	}
};

