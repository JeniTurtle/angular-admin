/**
 * Created by waka on 2017/3/31.
 */

// React
import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './AuthInfo.scss';

import InfoTitle from '../common/InfoTitle/InfoTitle';	// 信息标题
import AuthorAuthedRights from './AuthorAuthedRights/AuthorAuthedRights';	// 写作者认证后权益

// 引入图片
import authorV from './authorV.svg';
import copyrightV from './copyrightV.svg';

/**
 * 认证信息
 */
export default class AuthInfo extends Component {

	// 定义属性类型
	static propTypes = {
		name: PropTypes.string,	// 名字
		authState: PropTypes.number,	// 认证状态
		ability: PropTypes.number,	// 能力，用来区分写作者和影视人
		type: PropTypes.number,	// 认证类型：人；版权机构
		detail: PropTypes.string,	// 写作者：身份；影视人：公司简称·职位或作品名称·担任角色
		isAuthed: PropTypes.bool,	// 是否认证
		authData: PropTypes.object,	// 认证数据
	};

	// 设置默认属性
	static defaultProps = {
		name: '',
		authState: -1,
		ability: 0,
		type: 0,
		detail: '',
		isAuthed: true,
		authData: null,
	};

	/**
	 * 打开认证页
	 */
	handleOpenAuthPage() {
		window.open('https://www.yunlaiwu.com/auth/index');
	}

	/**
	 * 根据认证状态渲染
	 */
	renderByAuthState() {
		switch (this.props.authState) {
			// 未认证
			case -1:
				return <div>
					<div className={styles.row1}>
						<span>我的认证：</span>
						<span className={styles.authState}>未认证</span>
						<div
							className={styles.authBtn}
							onClick={this.handleOpenAuthPage.bind(this)}>
							去认证
						</div>
					</div>
					<div className={styles.authorAuthedRights}>
						<AuthorAuthedRights/>
					</div>
				</div>;
			// 审核中
			case 0:
				return <div>
					<div className={styles.row1}>
						<span>我的认证：</span>
						<span className={styles.authState}>审核中</span>
						<div
							className={styles.audittingBtn}
							onClick={this.handleOpenAuthPage.bind(this)}>
							审核中
						</div>
					</div>
					<div className={styles.authorAuthedRights}>
						<AuthorAuthedRights/>
					</div>
				</div>;
			// 审核未通过
			case 1:
				return <div>
					<div className={styles.row1}>
						<span>我的认证：</span>
						<span className={styles.authState}>审核未通过</span>
						<div
							className={styles.auditFailBtn}
							onClick={this.handleOpenAuthPage.bind(this)}>
							审核未通过
						</div>
					</div>
					<div className={styles.authorAuthedRights}>
						<AuthorAuthedRights/>
					</div>
				</div>;
			// 审核通过
			case 2:
				return <div>
					<div className={styles.row1}>
						<span>我的认证：</span>
						<div className={styles.authState}>
							<span>{this.props.name}</span>
							{this.props.type === 1 && this.props.ability > 0
								? <img className={styles.icon} src={authorV}/>
								: null
							}
							{this.props.type === 2 && this.props.ability > 0
								? <img className={styles.icon} src={copyrightV}/>
								: null
							}
							<span className={styles.detail}>{this.props.detail}</span>
						</div>
						<div className={styles.authedBtn}
							 onClick={() => {
								 window.open('http://user.yunlaiwu.com/#/authinfo');
							 }}>
							已认证
						</div>
					</div>
				</div>;
			default:
				return null;
		}
	}

	render() {

		return (
			<section className={styles.authInfo}>

				{/* 认证信息 */}
				<InfoTitle title="认证信息"/>
				{this.renderByAuthState()}
			</section>
		);
	}
};
