import React, {
	Component,
} from 'react';

import {
	Link
} from 'react-router';

import {
	connect
} from 'react-redux';

import styles from './Nav.scss';

import store from 'store';

import constant from '../../utils/constant';

import {
	isCurrentUserHasResumePermission,
} from '../../utils/myResumeUtil';

@connect(state => ({
	user: state.get('user')
}))

export default class Nav extends Component {

	render() {

		const {
			path,
			user
		} = this.props;

		// console.log('userId', user.get('objectId'));
		// console.log('type',);

		// 获得 userId
		const userId = user.get('objectId');

		// 是否是用户（和影视机构做区分）
		const isUser = user.get('type') === 1;

		// 默认不显示简历
		let isShowResume = false;
		// 只有当该用户是人（区别于影视机构）并且 在白名单里才显示简历
		if (isCurrentUserHasResumePermission(user.toJS())) {
			isShowResume = true;
		}

		// 得到是否进入过我的简历标识
		const isEnterMyResume = store.get(constant.isEnterMyResume);

		return (
			<section className={styles.navWrapper}>
				<nav className={styles.nav}>

					<Link to="/workspace" className={path === 'workspace' || !path ? styles.itemSelected : styles.item}>
						工 作 台
					</Link>

					<Link to="/iplist" className={path === 'iplist' ? styles.itemSelected : styles.item}>
						我的作品
					</Link>

					{isShowResume &&
					<Link to="/myresume"
						  className={path === 'myresume' ? styles.itemSelected : isEnterMyResume ? styles.item : styles.itemNew}>
						我的简历
					</Link>
					}

					<Link to="/mydeliver" className={path === 'mydeliver' ? styles.itemSelected : styles.item}>
						我的投稿
					</Link>

					<Link to="/orders" className={path === 'orders' ? styles.itemSelected : styles.item}>
						我的订单
					</Link>

					{
						(user.get('objectId') && !isUser) &&
						<Link to="/authorlist" className={path === 'authorlist' ? styles.itemSelected : styles.item}>
							签约作者
						</Link>
					}

					<a className={styles.item} target="_blank" href="http://www.yunlaiwu.com/myHomePage">我的主页</a>

					<Link to="/personalInfo" className={path === 'personalInfo' ? styles.itemSelected : styles.item}>
						我的信息
					</Link>

					<Link to="/focusPeople" className={path === 'focusPeople' ? styles.itemSelected : styles.item}>
						关注的人
					</Link>

					<Link to="/focusLiteratureList"
						  className={path === 'focusLiteratureList' ? styles.itemSelected : styles.item}>
						关注的作品
					</Link>

					<Link to="/datacenter" className={path === 'datacenter' ? styles.itemSelected : styles.item}>
						数据中心
					</Link>

					<a className={styles.item} target="_blank" href="http://banquanbaohu.com">版权保护</a>
				</nav>
			</section>
		);
	}
}
