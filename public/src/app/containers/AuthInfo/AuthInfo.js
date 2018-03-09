import React, {
	Component
} from 'react';

import {
	bindActionCreators
} from 'redux';

import styles from './AuthInfo.scss';

import {
	connect
} from 'react-redux';

import {
	Nav,
	Loading,
	Popup
} from '../../components';

import {
	fetchAuthData
} from '../../actions/HTTP';

import icon_1 from './ability-icon-1.png';
import icon_2 from './ability-icon-2.png';
import icon_3 from './ability-icon-3.png';
import icon_4 from './ability-icon-4.png';
import icon_5 from './ability-icon-5.png';
import icon_6 from './ability-icon-6.png';

@connect(state => ({
	user: state.get('user'),
	authInfo: state.get('authInfo'),
}), dispatch => bindActionCreators({
	fetchAuthData: fetchAuthData.bind(this, dispatch),
}, dispatch))

export default class AuthInfo extends Component {

	constructor(props) {
		super(props);

		this.state = {
			showPopup: false
		};
	}

	componentWillMount() {

		const {
			fetchAuthData
		} = this.props;

		fetchAuthData()

	}

	getAuthState(authState) {
		switch (authState) {
			case 0:
				return <p>审核中</p>
			case 1:
				return <p className={ styles.red }>变更不通过</p>
			case 2:
				return <p className={ styles.green }>已认证</p>
		}
		return <p className={ styles.red }>未认证</p>
	}

	getAuthType(authType) {
		switch (authType) {
			case 0:
				return <p>编剧/作家</p>
			case 1:
				return <p>机构</p>
			case 2:
				return <p>制片方</p>
		}
		return <p className={ styles.red }>未认证</p>
	}

	getAuthAbility(user) {
		var type = user.get('type'),
			ability = user.get('ability');

		if (type == 1 && ability == 1) {
			return <p>
				<span><img src={ icon_1 }/>免费出售作品</span>
				<span><img src={ icon_2 }/>免费投递征稿</span>
				<span><img src={ icon_3 }/>与版权方对话</span>
			</p>
		} else if (type == 1 && ability == 2) {
			return <p>
				<span><img src={ icon_5 }/>查看全文</span>
				<span><img src={ icon_4 }/>购买作品</span>
				<span><img src={ icon_6 }/>免费发布征稿</span>
				<span><img src={ icon_3 }/>与版权方对话</span>
			</p>
		} else if (type == 2 && ability == 2) {
			return <p>
				<span><img src={ icon_1 }/>免费出售作品</span>
				<span><img src={ icon_2 }/>免费投递征稿</span>
				<span><img src={ icon_3 }/>与制片方对话</span>
				<span><img src={ icon_4 }/>购买作品</span>
			</p>
		} else {
			return <p className={ styles.red }>未认证</p>
		}
	}

	getBusinessView(authInfo) {
		var movieFolkCertificationType = authInfo.get(0).get('movieFolkCertificationType');
		var title = <div className={ styles.row } style={ {'margin-top': '12px'} }>
			<p className={ styles.black }>行业资料</p>
		</div>;

		if (movieFolkCertificationType == 1) {
			return <div>
				{ title }
				<div className={ styles.row }>
					<p>作品名称：</p>
					{ authInfo.get(0).get('workTitle') }
				</div>
				<div className={ styles.row }>
					<p>作品类型：</p>
					{ authInfo.get(0).get('workType') == 1 ? '戏剧作品' : '影视作品' }
				</div>
				<div className={ styles.row }>
					<p>担任角色：</p>
					{ authInfo.get(0).get('workRole').replace(/,/g, '、') }
				</div>
				<div className={ styles.row } style={ {'height': 'auto'} }>
					<p>证明照片：</p>
					{ this.getImgBox(authInfo.get(0).get('workPicture')) }
				</div>
			</div>
		} else {
			return <div>
				{ title }
				<div className={ styles.row }>
					<p>公司简称：</p>
					{ authInfo.get(0).get('companyShortName') }
				</div>
				<div className={ styles.row }>
					<p>公司全称：</p>
					{ authInfo.get(0).get('companyName') }
				</div>
				<div className={ styles.row }>
					<p>公司职务：</p>
					{ authInfo.get(0).get('companyRole') }
				</div>
				<div className={ styles.row } style={ {'height': 'auto'} }>
					<p>证明照片：</p>
					{ this.getImgBox(authInfo.get(0).get('companyBusinessCardPicture')) }
				</div>
			</div>
		}
	}

	handleImageLoaded(event) {
		var height = event.target.height;
		if (height < 140) {
			var tmp = (140 - height) / 2;
		} else {
			var tmp = - (height - 140) / 2;
		}
		event.target.style.marginTop = tmp + "px";
	}

	getImgBox(url, alt) {
		return <div className={ styles.img_parent_box }>
			<div className={ styles.img_box }>
				<img className={ styles.picture } src={ url } onLoad={ this.handleImageLoaded }/>
				<div className={ styles.img_back }></div>
				<div className={ styles.shuiyin }>云莱坞认证专用</div>
			</div>
			{ !!alt
				? <div className={ styles.img_alt }>{ alt }</div>
				: ""
			}
		</div>
	}

	formatDate(time) {
		time *= 1000;
		var now = new Date(time);
		var year = now.getFullYear();
		var month = now.getMonth()+1;
		var date = now.getDate();
		return year + "年" + month + "月" + date + "日";
	}

	showPopup() {
		this.setState({showPopup: true});
	}

	closePopup() {
		this.setState({showPopup: false});
	}

	render() {

		const {
			user,
			authInfo,
			path,
		} = this.props;

		return (

			<div className={ styles.container }>

				<div style={ !!this.state.showPopup ? { 'display': 'block' } : { 'display': 'none' } } className={ styles.popupBack }></div>
				<div style={ !!this.state.showPopup ? { 'display': 'block' } : { 'display': 'none' } } className={ styles.popupBox }>
					<div className={ styles.popupParent }>
						<div className={ styles.popupChild }>
							<div className={ styles.popupTitle }>
								修改认证资料
								<span className={ styles.close } onClick={ this.closePopup.bind(this) }>×</span>
							</div>
							<div className={ styles.popupContent }>
								<img className={ styles.qrCode } src={ "https://yunlaiwu0.cn-bj.ufileos.com/auth-qr.png" } />
								<p>请使用云莱坞手机客户端（APP）扫描此二维码修改认证资料</p>
								<p className={ styles.gray }>还没有云莱坞APP？手机扫一扫此二维码下载</p>
							</div>
						</div>
					</div>
				</div>

				<Nav path={ path }/>
				<div className={ styles.contentContainer + ' pull-right'}>
					{ authInfo && authInfo.get(0)
						?
						<div>
							{/*<div className={ styles.breadcrumbs }>*/}
								{/*{ this.state.showPopup }我的工作台 &nbsp; > &nbsp; 个人信息 &nbsp; > &nbsp; 我的认证*/}
							{/*</div>*/}

							{ authInfo.get(0).get('authSubState') == 2 && authInfo.get(0).get('authState') == 0
								? <div className={ styles.tips }>
									温馨提示：请耐心等待，认证资料的修改正在审核中，预计{ this.formatDate(authInfo.get(0).get('updateAt') + 2 * 24 * 60 * 60) }处理完毕
								</div>
								: ""
							}

							{ authInfo.get(0).get('authSubState') == 2 && authInfo.get(0).get('authState') == 1
								? <div className={ styles.tips }>
								认证资料的修改未通过：{ authInfo.get(0).get('reason') }
							</div>
								: ""
							}

							<div className={ styles.authInfoContent }>
								<div className={ styles.row }>
									<p className={ styles.strong }>我的认证</p>
									{ this.getAuthState(authInfo.get(0).get('authState')) }

									<a onClick={ this.showPopup.bind(this) } className={ styles.updateBtn }>修改</a>
								</div>

								{ authInfo.get(0).get('authType') == 2
									?
									<div className={ styles.row } style={ {'margin-top': '12px'} }>
										<p className={ styles.black }>个人资料</p>
									</div>
									: ""
								}
								<div className={ styles.row }>
									<p>认证身份：</p>
									{ this.getAuthType(authInfo.get(0).get('authType')) }
								</div>
								<div className={ styles.row }>
									<p>获得的权益：</p>
									{ this.getAuthAbility(user) }
								</div>

								{ authInfo.get(0).get('authType') == 0 || authInfo.get(0).get('authType') == 2
									?
									<div>
										<div className={ styles.row }>
										<p>常用名：</p>
										<p>{ authInfo.get(0).get('username') }</p>
										</div>
										<div className={ styles.row }>
										<p>证件类型：</p>
										<p>{ authInfo.get(0).get('credentialType') == 1 ? '护照' : '身份证' }</p>
										</div>
										<div className={ styles.row }>
										<p>{ authInfo.get(0).get('credentialType') == 1 ? '护照姓名：' : '身份证姓名：' }</p>
										<p>{ authInfo.get(0).get('credentialName') }</p>
										</div>
										<div className={ styles.row }>
										<p>{ authInfo.get(0).get('credentialType') == 1 ? '护照号码：' : '身份证号码：' }</p>
										<p>{ authInfo.get(0).get('credentialNumber') }</p>
										</div>
										{ authInfo.get(0).get('credentialType') == 1
											?
											<div className={ styles.row } style={ {'height': 'auto'} }>
												<p>护照照片：</p>
												{ this.getImgBox(authInfo.get(0).get('credentialPicture')) }
											</div>
											: ''
										}
										{ authInfo.get(0).get('authType') == 2
											? this.getBusinessView(authInfo)
											: ''
										}
									</div>
									:
									<div>
										<div className={ styles.row }>
											<p>公司简称：</p>
											{ authInfo.get(0).get('companyShortName') }
										</div>
										<div className={ styles.row }>
											<p>公司全称：</p>
											{ authInfo.get(0).get('companyName') }
										</div>
										<div className={ styles.row }>
											<p>营业执照号：</p>
											{ authInfo.get(0).get('businessLicenseNumber') }
										</div>
										<div className={ styles.row } style={ {'height': 'auto'} }>
											<p>证明照片：</p>
											{ this.getImgBox(authInfo.get(0).get('businessLicensePicture'), '营业执照') }
											{ this.getImgBox(authInfo.get(0).get('companyCertificationPicture'), '单位证明') }
										</div>
									</div>
								}
							</div>
						</div>
						:
						<div style={{ marginTop: '200px' }}>
							<Loading />
						</div>
					}

				</div>
			</div>
		);
	}
}
