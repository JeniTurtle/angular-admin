/**
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './Avatar.scss';

/**
 * 头像组件
 */
export default class Avatar extends Component {

	// 定义属性类型
	static propTypes = {
		size: PropTypes.number,	// 头像大小，单位px
		url: PropTypes.string,	// 头像url
		background: PropTypes.string,	// 头像背景
		text: PropTypes.string,	// 头像文本
		textFontSize: PropTypes.number,	// 头像文本大小
		textColor: PropTypes.string, 	// 头像文本颜色
		isMouseOverShowMask: PropTypes.bool,	// 鼠标滑过是否显示遮罩层，默认不显示
		maskText: PropTypes.string,	// 遮罩层文本
		maskTextFontSize: PropTypes.number,	// 遮罩层文本大小
		maskTextColor: PropTypes.string, 	// 遮罩层文本颜色
		onClick: PropTypes.func,	// 头像点击事件
		cursor: PropTypes.string,	// 鼠标指向指针状态
	};

	// 设置默认属性
	static defaultProps = {
		size: 56,
		url: '',
		background: '',
		text: '',
		textFontSize: 16,
		textColor: '#000',
		isMouseOverShowMask: false,
		maskText: '',
		maskTextFontSize: 16,
		maskTextColor: '#fff',
		cursor: 'default'
	};

	constructor(props) {
		super(props);
		// 初始化内部状态
		this.state = {
			maskToggle: false 	// 遮罩层显示开关
		}
	}

	onMouseEnter() {
		// console.log('onMouseEnter');
		this.setState({
			maskToggle: true
		});
	}

	onMouseLeave() {
		// console.log('onMouseLeave');
		this.setState({
			maskToggle: false
		});
	}

	handleClick() {
		if (this.props.onClick) {
			this.props.onClick();
		}
	}

	render() {
		return (
			<section
				className={styles.avatarWrapper}
				style={{
					cursor: this.props.cursor
				}}
				onMouseEnter={this.onMouseEnter.bind(this)}
				onMouseLeave={this.onMouseLeave.bind(this)}
				onClick={this.handleClick.bind(this)}>
				{/* 头像 */}
				<div className={styles.avatar}
					 style={{
						 // 注：background系列属性的顺序很重要，是依次覆盖的关系
						 // background会覆盖backgroundImage
						 // backgroundSize会覆盖background，以实现需要的效果
						 backgroundImage: 'url(' + this.props.url + ')',
						 background: this.props.background,
						 backgroundSize: 'cover',
						 backgroundRepeat: 'no-repeat',
						 width: this.props.size + 'px',
						 height: this.props.size + 'px',
					 }}>
					{/* 头像文本 */}
					<div className={styles.text}
						 style={{
							 color: this.props.textColor,
							 fontSize: this.props.textFontSize + 'px'
						 }}>
						{this.props.text}
					</div>
				</div>
				{/* 遮罩层 */}
				{this.props.isMouseOverShowMask 	// 用户开启滑过显示遮罩层后才渲染遮罩层
					? <div className={styles.avatarMask}
						   style={{
							   display: this.state.maskToggle ? 'flex' : 'none',
							   width: this.props.size + 'px',
							   height: this.props.size + 'px',
						   }}>
						{/* 遮罩层文本 */}
						<div className={styles.maskText}
							 style={{
								 color: this.props.maskTextColor,
								 fontSize: this.props.maskTextFontSize + 'px'
							 }}>
							{this.props.maskText}
						</div>
					</div>
					: null
				}
			</section>
		);
	}
}
