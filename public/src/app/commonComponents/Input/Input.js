/**
 * Created by waka on 2017/4/6.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './Input.scss';

/**
 * input
 */
export default class Input extends Component {

	// 定义属性类型
	static propTypes = {
		getRealDOM: PropTypes.func,	// 得到证实DOM
		width: PropTypes.number,	// 宽度
		value: PropTypes.string,	// 输入框的值
		placeholder: PropTypes.string,	// 提示语
		maxWordsCount: PropTypes.number,	// 最大输入字数
		onChange: PropTypes.func,	// 当改变发生
		onError: PropTypes.func,	// 错误回调
		fontSize: PropTypes.number,	// 字体大小
		borderColor: PropTypes.string,	// 边框颜色
		innerWidth: PropTypes.number,	// 内部input宽度；限制宽度；该值为计算后得出；公式为总input的宽度-右侧限制数字的宽度-左边padding的宽度
	};

	// 设置默认属性
	static defaultProps = {
		getRealDOM: null,
		width: 400,
		value: '',
		placeholder: '',
		onChange: null,
		onError: null,
		fontSize: 14,
		borderColor: '',
		innerWidth: 340,
	};

	constructor(props) {
		super(props);

		// 值是否被手动修改
		this.changed = false;

		// 内部维护状态
		this.state = {
			value: props.value,	// 当前值
			curWordsCount: props.value ? props.value.length : 0,	// 当前input输入字数
			isFocus: false,	// 是否获得焦点
		}
	}

	componentDidMount() {
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

	handleGetRealDOM(input) {
		// console.log('handleGetRealDOM input = ', input);
		this.input = input;
		if (this.props.getRealDOM) {
			this.props.getRealDOM(input);
		}
	}

	render() {

		// 外层样式
		const wrapperStyle = {};
		wrapperStyle.width = this.props.width + 'px';	// 设置宽度
		wrapperStyle.borderColor = this.state.isFocus ? '#0037FF' : '#DBDBDB';	// 设置边框颜色
		if (this.props.borderColor) {	// 如果外部传入了边框颜色，使用外部传入的边框颜色，主要是为了解决错误时变红的问题
			wrapperStyle.borderColor = this.props.borderColor;
		}

		return (
			/* input wrapper2 包裹Input的div，用于减少input边框带来的宽高问题，和方便计数展示组件的绝对定位 */
			<section
				className={styles.wrapper}
				// 根据是否获得焦点来变化外边框颜色样式
				style={wrapperStyle}>

				{/* input */}
				<input
					className={styles.input}
					style={{
						fontSize: this.props.fontSize,
						width: this.props.maxWordsCount 	// 这里需要判断一下是否传入最大数
							? this.props.innerWidth + 'px' 	// 如果传入，需要给最大数留出位置
							: '100%' 	// 不传入，直接100%
					}}
					value={this.state.value}
					placeholder={this.props.placeholder}

					// 获得真实DOM；因为需要获得input的值，所以需要获得DOM
					ref={this.handleGetRealDOM.bind(this)}
					onChange={() => {
						this.changed = true;
						// 更新state
						this.setState(() => {
							return {
								value: this.input.value,	// 当前真实的值
								curWordsCount: this.input.value.length,	// 获得输入文本长度
							}
						});
						if (this.input.value.length > this.props.maxWordsCount && this.props.onError) {
							this.props.onError(true);
						} else {
							if (this.props.onError) {
								this.props.onError(false);
							}
						}
						// 调用外部监听函数
						if (this.props.onChange) {
							this.props.onChange(this.input.value);
						}
					}}

					// 这里监听聚焦和取消聚焦主要是为了控制外边框的样式
					onFocus={() => {
						// console.log('onFocus');
						this.setState((prevState) => {
							return {isFocus: true}
						});
					}}
					onBlur={() => {
						// console.log('onBlur');
						this.setState((prevState) => {
							return {isFocus: false}
						});
					}}/>

				{/* input字数 */}
				{this.props.maxWordsCount
					? <span
						className={styles.inputWordsCount}
						style={{
							fontSize: this.props.fontSize,
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
