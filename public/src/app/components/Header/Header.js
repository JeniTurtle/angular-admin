import React, {
	Component
} from 'react';

import {
	Link
} from 'react-router';
import {
	connect
} from 'react-redux';
import styles from './Header.scss';

import {
	bindActionCreators
} from 'redux';

import {
	changeChromeDownloadModal,
} from '../../actions/App';

@connect(
	state => ({
		user: state.get('user'),
		app: state.get('app'),
	}),
	dispatch => bindActionCreators({
		changeChromeDownloadModal: changeChromeDownloadModal,
	}, dispatch)
)

export default class Header extends Component {

	constructor() {
		super();
	}

	componentWillMount() {
	}

	getAuthUrl = (state) => {
		if (state === 'authed') {
			return "http://user.yunlaiwu.com/#/authinfo"
		} else {
			return "http://www.yunlaiwu.com/auth/index"
		}
	};

	render() {

		const {
			path,
			user,
			app,
			changeChromeDownloadModal,
		} = this.props;

		const chromeDownloadModal = app.get('chromeDownloadModal').toJS();

		return (
			<header className="headerWrapper">
				<section className="header">
					{chromeDownloadModal.isWarningShow &&
					<section className="warningWrapper">
						<section className="warning">
							<div className="text">{chromeDownloadModal.tips}
								{/*<i className="iconfont icon-guanbi"*/}
								{/*onClick={() => {*/}
								{/*changeChromeDownloadModal({*/}
								{/*isWarningShow: false,*/}
								{/*})*/}
								{/*}}/>*/}
								<a className="downloadLink" target="_blank"
								   href={chromeDownloadModal.link}>去下载</a>
							</div>
						</section>
					</section>
					}
					<div className="header-inner">
						<a href="//www.yunlaiwu.com/index" target="_blank">
							<img className="imgLogo"
								// width={78}
								// height={23}
								 src="//yunlaiwu0.cn-bj.ufileos.com/logoBlackSmall_pc_v4.svg"
								 alt="logo"/>
						</a>
						<div className="home">
							<Link to="/workspace">
								{/*<img src={user.get('avatar')}/>*/}
								<span className="name">{user.get('username')}</span>
								{user.get('authState') === 'authed' &&
								<span style={{background: user.get('type') === 1 ? '#ffc800' : '#00acff'}}
									  className="sicon">v</span>
								}
								{user.get('authState') !== 'authed' &&
								<span style={{background: '#999'}} className="sicon">v</span>
								}
							</Link>
							<div className="nav-layer">
								<div className="ulist">
									<a className="uitem" target="_blank" href={this.getAuthUrl(user.get('authState'))}>
										身份认证
									</a>
									<a className="uitem" href="http://www.yunlaiwu.com/dologout?current_page=/index"
									   id="logout">
										安全退出
									</a>
								</div>
							</div>
						</div>
						{user.get('authState') === 'unauth' &&
						<a target="_blank" href="http://www.yunlaiwu.com/auth/index" className="toAuth">去认证 ></a>
						}
					</div>
				</section>
			</header>
		);
	}
}
