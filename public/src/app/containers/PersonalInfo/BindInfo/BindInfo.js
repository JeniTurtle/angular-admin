/**
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './BindInfo.scss';

import InfoTitle from '../common/InfoTitle/InfoTitle';	// 信息标题
import InfoItem from '../common/InfoItem/InfoItem';	// 信息项

/**
 * 绑定信息
 */
export default class BindInfo extends Component {

	// 定义属性类型
	static propTypes = {
		phone: PropTypes.string,	// 手机号
		phoneRightText: PropTypes.string,	// 手机号右侧文本
		wechat: PropTypes.string,	// 微信号
		wechatRightText: PropTypes.string,	// 微信号右侧文本
		weibo: PropTypes.string,	// 微博
		weiboRightText: PropTypes.string,	// 微博号右侧文本
		onBindPhoneClick: PropTypes.func,	// 绑定手机点击事件
		onBindWechatClick: PropTypes.func,	// 绑定微信点击事件
		onBindWeiboClick: PropTypes.func,	// 绑定微博点击事件
	};

	// 设置默认属性
	static defaultProps = {
		phone: '',
		wechat: '',
		weibo: '',
		onBindPhoneClick: null,
		onBindWechatClick: null,
		onBindWeiboClick: null,
	};

	render() {
		return (
			<section className={styles.bindInfo}>

				{/* 绑定信息 */}
				<InfoTitle title="绑定信息"/>

				{/* 绑定手机 */}
				<InfoItem title="绑定手机："
						  content={this.props.phone}
						  btnText={this.props.phoneRightText}
						  onRightClick={() => {
							  if (this.props.onBindPhoneClick) {
								  this.props.onBindPhoneClick();
							  }
						  }}/>

				{/* 绑定微信 */}
				<div
					style={{
						display: 'none'
					}}>
					<InfoItem
						title="绑定微信："
						content={this.props.wechat}
						btnText={this.props.wechatRightText}
						onRightClick={() => {
							if (this.props.onBindWechatClick) {
								this.props.onBindWechatClick();
							}
						}}/>
				</div>

				{/* 绑定微博 */}
				<div
					style={{
						display: 'none'
					}}>
					<InfoItem
						title="绑定微博："
						content={this.props.weibo}
						btnText={this.props.weiboRightText}
						onRightClick={() => {
							if (this.props.onBindWeiboClick) {
								this.props.onBindWeiboClick();
							}
						}}/>
				</div>

			</section>
		);
	}
};
