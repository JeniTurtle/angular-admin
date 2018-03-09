/************************** React ****************************/

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import styles from './App.scss';

import {
	Warning,
	Footer,
	Header,
	Toast,
	Loading,
	Popup
} from '../../components';

import {
	Alert,
} from '../index';

/************************** React Helmet ****************************/

// document header management
import Helmet from 'react-helmet';
import config from '../../config';

import {
	Link,
} from 'react-router';

import store from 'store';	// 跨浏览器本地存储

import {
	Modal,
} from '../../components';

/************************** Redux ****************************/

import {
	bindActionCreators
} from 'redux';

import {
	connect
} from 'react-redux';

import {
	fetchUser
} from '../../actions/HTTP';

import {
	changeResumeExplainModalShowStatus,
	changeChromeDownloadModalShowStatus,
	changeChromeDownloadModal,
} from '../../actions/App';

import {
	getPathFromLocation
} from '../../utils/funcs';

import constant from '../../utils/constant';	// 常量类

import {
	isCurrentUserHasResumePermission,
} from '../../utils/myResumeUtil';
import {
	getBrowserType,
} from '../../utils/userAgentUtil';

@connect(
	state => ({
		user: state.get('user'),
		app: state.get('app'),
	}),
	dispatch => bindActionCreators({
		fetchUser: fetchUser.bind(this, dispatch),
		changeResumeExplainModalShowStatus: changeResumeExplainModalShowStatus,
		changeChromeDownloadModalShowStatus: changeChromeDownloadModalShowStatus,
		changeChromeDownloadModal: changeChromeDownloadModal,
	}, dispatch)
)

export default class App extends Component {

	static propTypes = {
		children: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);

		this.props.fetchUser();
	}

	componentWillMount() {

		const {
			app,
			changeChromeDownloadModal,
		} = this.props;

		// 获得浏览器类型
		const broswerType = getBrowserType();
		const firstNumber = broswerType.number.split('.')[0];	// 获得大版本号
		// console.log('broswerType', broswerType, 'firstNumber', firstNumber);

		// 浏览器既不是 chrome 也不是 safari
		if (broswerType.type === 'Chrome' || broswerType.type === 'Safari') {
			if (broswerType.type === 'Safari' && firstNumber < 6) {
				changeChromeDownloadModal({
					isShow: true,
					isWarningShow: true,
					tips: '您当前浏览器的版本过低，为了保证您的体验请升级',
					link: 'http://www.baidu.com/s?wd=Safari',
				});
			} else {
				changeChromeDownloadModal({
					isShow: false,
					isWarningShow: false,
				});
			}
		} else {
			changeChromeDownloadModal({
				isShow: true,
				isWarningShow: true,
				tips: '为了保证您的体验，请下载Chrome浏览器',
				link: 'http://www.baidu.com/s?wd=Chrome',
			});
		}
	}

	// 简历说明对话框关闭按钮点击
	handleExplainModalCloseClick() {
		const {
			changeResumeExplainModalShowStatus,
		} = this.props;

		// 隐藏简历说明对话框
		changeResumeExplainModalShowStatus(false);
	}

	// 简历说明对话框跳转到我的简历<Link>标签点击
	handleExplainModalToMyResumeClick() {
		const {
			changeResumeExplainModalShowStatus,
		} = this.props;

		// 隐藏简历说明对话框
		changeResumeExplainModalShowStatus(false);
	}

	render() {

		const {
			location,
			user,
			children,
			app,
			changeResumeExplainModalShowStatus,
			changeChromeDownloadModal,
		} = this.props;

		const titleMapping = {
			'authorlist': '签约作者',
			'historylist': '版权小站',
			'ipdetail': '编辑作品',
			'ipinfo': '编辑作品',
			'iplist': '我的作品',
			'preview': '预览',
			'raw': '编辑作品',
			'praw': '编辑作品',
			'done': '编辑作品',
			'ipconfig': '作品设置',
			'datacenter': '数据中心',
			'datadetail': '数据中心',
			'orders': '我的订单',
			'workspace': '工作台'
		};

		// chrome下载对话框展示状态
		const chromeDownloadModal = app.get('chromeDownloadModal').toJS();
		const chromeDownloadModalShowStatus = app.get('chromeDownloadModal').get('isShow');
		// console.log('chrome下载对话框展示状态', chromeDownloadModalShowStatus);

		// 说明简历对话框展示状态
		const resumeExplainModalShowStatus = app.get('resumeExplainModalShowStatus');

		// 当前用户是否有简历权限
		const isCurrentUserHasResumePermissionResult = isCurrentUserHasResumePermission(user.toJS());
		// console.log('当前用户是否有简历权限 isCurrentUserHasResumePermissionResult', isCurrentUserHasResumePermissionResult);
		if (isCurrentUserHasResumePermissionResult) {
			// 获得是否已经显示过简历说明对话框
			const isShowResumeExplainModalAlready = store.get(constant.isShowResumeExplainModalAlready);
			// console.log('isShowResumeExplainModalAlready 获得是否已经显示过简历说明对话框', isShowResumeExplainModalAlready);
			// 如果没有显示过 并且 chrome 下载对话框已关闭
			if (!isShowResumeExplainModalAlready && !chromeDownloadModalShowStatus) {
				// 显示简历说明对话框
				changeResumeExplainModalShowStatus(true);
				store.set(constant.isShowResumeExplainModalAlready, true);
			}
		}

		const path = getPathFromLocation(location);

		const whetherOK = user && user.get('objectId');

		window._hmt && _hmt.push(['_trackEvent', 'pv', 'pv_' + path]);

		if (path === 'ipinfo') {
			$('#pviframe').attr('src', 'http://user.yunlaiwu.com/pv/' + (location.pathname.length > 10 ? 'updateipinfo' : 'newipinfo'));
		}
		else {
			$('#pviframe').attr('src', 'http://user.yunlaiwu.com/pv/' + (path || 'workspace'));
		}

		return (
			<div className={styles.app + ' clearfix'}>
				<Helmet title={titleMapping[path] || '版权小站'} {...config.app.head}/>
				<Header path={path}/>
				<Warning/>
				<Toast/>
				<Popup/>
				<Alert/>
				{/* chrome 下载提示框 */}
				{chromeDownloadModalShowStatus &&
				<Modal width="500px"
					   height="160px"
					   onCloseClick={() => {
						   changeChromeDownloadModal({
							   isShow: false,
						   })
					   }}>
					<section className={styles.modal}>
						<div className={styles.title}>{chromeDownloadModal.tips}</div>
						<a className={styles.btn}
						   target="_blank"
						   href={chromeDownloadModal.link}
						   onClick={() => {
							   changeChromeDownloadModal({
								   isShow: false,
							   })
						   }}>去下载</a>
					</section>
				</Modal>
				}
				{/* 简历功能说明弹窗 */}
				{/* 简历说明模态框显示状态为 true 并且 当前用户具有简历权限 */}
				{resumeExplainModalShowStatus && isCurrentUserHasResumePermissionResult &&
				<section className={styles.explainModalWrapper}>
					<section className={styles.explainModal}>
						<i className="iconfont icon-guanbi"
						   style={{
							   position: 'absolute',
							   top: '15px',
							   right: '16px',
							   color: '#D4D9E2',
							   fontSize: '26px',
							   fontWeight: 'bold',
							   cursor: 'pointer',
						   }}
						   onClick={this.handleExplainModalCloseClick.bind(this)}/>
						<div className={styles.title}>简历功能 全新上线</div>
						<img className={styles.img1} width={460} height={185}
							 src="//yunlaiwu0.cn-bj.ufileos.com/resume_tips_modal_img1.png" alt=""/>
						<div className={styles.tips}>以下服务即将推出，填写简历可优先体验</div>
						<section className={styles.bottom}>
							<div className={styles.left}>
								<div className={styles.title1}>与知名影视公司深度合作</div>
								<img className={styles.img1} width={210} height={185}
									 src="https://yunlaiwu0.cn-bj.ufileos.com/resume_tips_modal_img3.png" alt=""/>
							</div>
							<div className={styles.right}>
								<div className={styles.title1}>与大咖编剧合作改编超级IP</div>
								<img className={styles.img1} width={210} height={185}
									 src="https://yunlaiwu0.cn-bj.ufileos.com/resume_tips_modal_img2.png" alt=""/>
							</div>
						</section>
						<Link className={styles.btn}
							  to="/myresume"
							  onClick={this.handleExplainModalToMyResumeClick.bind(this)}>去填写</Link>
					</section>
				</section>
				}
				{whetherOK && React.Children.map(children, child => React.cloneElement(child, {
						path: path
					})
				)}
				{!whetherOK && <Loading/>}
				<Footer/>
			</div>
		);
	}
}
