/**
 * Created by waka on 2017/3/30.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// 引入样式
import styles from './Person.scss';

import {
	Avatar	// 头像
} from '../../../../commonComponents';

import authorV from './authorV.svg';
import copyrightV from './copyrightV.svg';

import FocusButton from './FocusButton/FocusButton';	// 关注按钮

/**
 * 人员项
 */
export default class Person extends Component {

	// 定义属性类型
	static propTypes = {
		ability: PropTypes.number,	// 能力
		type: PropTypes.number,	// 类型
		uid: PropTypes.string,	// 唯一标识
		avatarImgUrl: PropTypes.string,	// 头像路径
		name: PropTypes.string,	// 名字
		desc: PropTypes.string,	// 描述
		isShowFocusButton: PropTypes.bool,	// 是否显示关注按钮
		index: PropTypes.number, // 下标
		onFocusButtonClick: PropTypes.func,	// 关注按钮点击事件
		isAlreadyFocus: PropTypes.bool,	// 是否已关注
	};

	// 设置默认属性
	static defaultProps = {
		ability: 0,
		type: 0,
		avatarImgUrl: '',
		name: '',
		isV: false,
		desc: '',
		isShowFocusButton: false,
		isAlreadyFocus: false
	};

	// 头像点击事件
	handleAvatarClick() {
		// console.log('handleAvatarClick', this.props.uid);
		const uid = this.props.uid;
		window.open('http://www.yunlaiwu.com/myHomePage?uid=' + uid, '_blank');
		// window.open('http://waka.yunlaiwu.com:3000/myHomePage?uid=' + uid, '_blank');
	}

	// 关注按钮点击事件
	onFocusButtonClick(e) {
		// console.log('onFocusButtonClick', this.props.index);
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		if (this.props.onFocusButtonClick) {
			this.props.onFocusButtonClick(this.props.index, this.props.uid, this.props.isAlreadyFocus);
		}
	}

	render() {

		let username = this.props.name;
		// 如果用户名是手机号，把中间四位变为*
		if (/^1[34578]\d{9}$/.test(username)) {
			const front3 = username.substring(0, 3);
			const behind4 = username.substring(7, 11);
			username = front3 + '****' + behind4;
		}

		// 测试数据
		return (
			<section
				className={styles.person}
				onClick={this.handleAvatarClick.bind(this)}>
				{/* 头像 */}
				<div className={styles.avatar}>
					<img
						width={80}
						height={80}
						src={this.props.avatarImgUrl}
						style={{
							borderRadius: '50%',
							cursor: 'pointer'
						}}
						alt=""/>
				</div>
				{/* 名字 */}
				<div className={styles.name}>
					<span>{username}</span>
					{/* 写作者/影视人 */}
					{this.props.ability > 0 && this.props.type === 1
						? <img className={styles.icon} src={authorV}/>
						: null
					}
					{/* 版权机构 */}
					{this.props.ability > 0 && this.props.type === 2
						? <img className={styles.icon} src={copyrightV}/>
						: null
					}
				</div>

				{/* 描述 */}
				{this.props.isShowFocusButton
					// 如果有关注按钮，就有溢出省略号
					? <span className={styles.descEllipsis}>{this.props.desc}</span>
					: <span className={styles.desc}>{this.props.desc}</span>
				}
				{/* 关注按钮 */}
				{this.props.isShowFocusButton
					? <div
						className={styles.focusButton}
						onClick={this.onFocusButtonClick.bind(this)}>
						<FocusButton isAlreadyFocus={this.props.isAlreadyFocus}/>
					</div>
					: null
				}
			</section>
		);
	}
}
