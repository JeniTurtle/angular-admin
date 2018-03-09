/**
 * Created by waka on 12/04/2017.
 */

/********************************** React ****************************************/

import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// 引入样式
import styles from './ModalPasswordSetting.scss';

// 引入图片
import step1Img from './step1.svg';
import step2Img from './step2.svg';
import successImg from './success.svg';
import closeImg from './close.svg';

// 公共组件
import {
	Spin
} from '../../../commonComponents'

// 内部组件
import InputRow from './InputRow/InputRow';

/********************************** Util ****************************************/

import {
	verifyMobileNumber,
	verifyAuthCode,
} from '../../../utils/regExp';

/********************************** Immutable ****************************************/

import {
	Map
} from 'immutable';

/********************************** Redux ****************************************/

import {
	bindActionCreators
} from 'redux';

import {
	connect
} from 'react-redux';

// 引入action
import {
	requestSmsCode,	// 发送短信验证码
	verifySms,	// 验证码验证接口
	setPassword,	// 密码修改接口
	logout,	// 登出
} from '../../../actions/HTTP';

import {	// 弹出层
	showWarning,
} from '../../../actions/Popups';

@connect(state => ({
	user: state.get('user'),
	personalInfo: state.get('personalInfo'),
}), dispatch => bindActionCreators({
	requestSmsCode: requestSmsCode.bind(this, dispatch),
	verifySms: verifySms.bind(this, dispatch),
	setPassword: setPassword.bind(this, dispatch),
	logout: logout.bind(this, dispatch),
	showWarning,
}, dispatch))

/**
 * 密码设置模态框
 */
export default class ModalPasswordSetting extends Component {

	// 定义属性类型
	static propTypes = {
		type: PropTypes.number,	// 类型，用来区分展示哪个页面；1.验证手机号;2.重置密码页面;3.重置密码成功页面
		mobile: PropTypes.string,	// 手机号
		onClose: PropTypes.func,	// 关闭
		onBindPhoneClick: PropTypes.func,	// 绑定手机
	};

	// 设置默认属性
	static defaultProps = {
		type: 1,
		mobile: '',
		onClose: null,
		onBindPhoneClick: null,
	};

	constructor(props) {
		super(props);
		this.state = {

			// 验证手机号
			mobile: '',	// 手机号
			mobileVerifyStatus: 0,	// 手机号验证状态: -1错误；0默认；1成功
			mobileVerifyTips: '',	// 手机号验证提示信息
			isMobileInputFocus: false,	// 手机号输入框是否获得焦点
			authCode: '',	// 验证码
			authCodeVerifyStatus: 0,	// 验证码验证状态
			authCodeVerifyTips: '',	// 验证码验证提示信息
			isAuthCodeInputFocus: false,	// 验证码输入框是否获得焦点
			surplusTime: 0,	// 短信验证码剩余时间
			remainingTime: 0,	// 发送短信验证码剩余时间

			// 密码设置
			password: '',	// 密码
			passwordVerifyStatus: 0,	// 密码验证状态: -1错误；0默认；1成功
			passwordVerifyTips: '',	// 密码验证提示信息
			passwordConfirm: '',	// 确认密码
			passwordConfirmVerifyStatus: 0,	// 确认密码验证状态: -1错误；0默认；1成功
			passwordConfirmVerifyTips: '',	// 确认密码验证提示信息

			// 填写验证码图片时间戳
			validatecodeTimeStamp: new Date().getTime(),

		};
	}

	handleMaskClick(e) {
		e.preventDefault();
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		// console.log('handleMaskClick');

		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	/**
	 * 监听手机号变化
	 * @param event
	 */
	handleMobileNumberChange(event) {
		const value = event.target.value;
		// 实现实时输入监听是否正确
		if (verifyMobileNumber(value)) {
			this.setState(() => {
				return {
					mobileVerifyStatus: 1
				};
			});
		} else {
			this.setState(() => {
				return {
					mobileVerifyStatus: 0,
					mobileVerifyTips: '',
				};
			});
		}
		// 改变state的值
		this.setState(() => {
			return {
				mobile: value
			};
		});
	}

	/**
	 * 监听验证码变化
	 * @param event
	 */
	handleAuthCodeChange(event) {
		const value = event.target.value;
		this.setState(() => {
			return {
				authCode: value
			};
		});
	}

	/**
	 * 发送验证码
	 */
	handleSendAuthCode() {
		// console.log('mobile', this.state.mobile);

		// 校验手机号
		if (!verifyMobileNumber(this.state.mobile)) {
			this.setState(() => {
				return {
					mobileVerifyStatus: -1,
					mobileVerifyTips: '您输入的手机号码有误'
				}
			});
			return;
		}

		// 发送验证码
		this.props.requestSmsCode(this.state.mobile);

		this.setState({
			validatecodeTimeStamp: new Date().getTime(),
		});
	}

	/**
	 * 下一步 (验证手机号) (验证码验证接口)
	 */
	handleNextStep() {
		// console.log('下一步 this.state = ', this.state);

		// 校验手机号
		if (!verifyMobileNumber(this.state.mobile)) {
			this.setState(() => {	// 错误提示
				return {
					mobileVerifyStatus: -1,
					mobileVerifyTips: '您输入的手机号码有误'
				}
			});
			return;
		}
		this.setState(() => {	// 成功提示
			return {
				mobileVerifyStatus: 1,
				mobileVerifyTips: ''
			}
		});

		// 校验验证码
		if (!verifyAuthCode(this.state.authCode)) {
			this.setState(() => {
				return {
					authCodeVerifyStatus: -1,
					authCodeVerifyTips: '验证码不正确'
				}
			});
			return;
		}
		this.setState(() => {	// 成功提示
			return {
				authCodeVerifyStatus: 1,
				authCodeVerifyTips: ''
			}
		});

		// 请求 验证验证码
		this.props.verifySms(this.state.mobile, this.state.authCode);
	}

	/**
	 * 绑定手机点击事件
	 */
	handleBindPhoneClick() {
		if (this.props.onBindPhoneClick) {
			this.props.onBindPhoneClick();
		}
	}

	/**
	 * 密码改变
	 * @param value
	 */
	handlePasswordChange(value) {
		this.setState(() => {
			return {
				password: value
			}
		});
	}

	/**
	 * 密码确认改变
	 * @param value
	 */
	handlePasswordConfirmChange(value) {
		this.setState(() => {
			return {
				passwordConfirm: value
			}
		});
	}

	/**
	 * 设置密码
	 */
	handleSetPassword() {
		// console.log('设置密码 handleSetPassword', this.state.password);

		if (this.verifyPassword()) {
			const password = this.state.password;
			let hash = '';
			try {
				hash = this.props.personalInfo.get('proccessingVerifySms').get('data').get('hash');
			} catch (e) {
				// console.log('hash值不存在', e.message, e);
				// this.props.showWarning('hash值不存在redux', 'danger');
			}
			// console.log('password = ', password, 'hash = ', hash);
			this.props.setPassword(password, hash);
		}
	}

	/**
	 * 校验密码
	 * @return {boolean}
	 */
	verifyPassword() {

		// 校验密码
		if (!this.state.password) {
			this.setState(() => {
				return {
					passwordVerifyStatus: -1,
					passwordVerifyTips: '密码不能为空'
				}
			});
			return false;
		}
		this.setState(() => {
			return {
				passwordVerifyStatus: 1,
				passwordVerifyTips: '',
			}
		});

		// 校验第二次输入的密码
		if (!this.state.passwordConfirm) {
			this.setState(() => {
				return {
					passwordConfirmVerifyStatus: -1,
					passwordConfirmVerifyTips: '请再次输入密码'
				}
			});
			return false;
		}

		// 校验两次密码是否输入一致
		if (this.state.password !== this.state.passwordConfirm) {
			this.setState(() => {
				return {
					passwordConfirmVerifyStatus: -1,
					passwordConfirmVerifyTips: '两次输入的密码不一致'
				}
			});
			return false;
		}

		// 校验通过
		this.setState(() => {
			return {
				passwordVerifyStatus: 1,
				passwordVerifyTips: '',
				passwordConfirmVerifyStatus: 1,
				passwordConfirmVerifyTips: ''
			}
		});

		return true;
	}

	/**
	 * 重新登录
	 */
	handleSignInAgain() {
		// console.log('SignInAgain 重新登录');

		if (this.props.onClose) {
			this.props.onClose();
		}

		this.props.logout();	// 登出
	}

	render() {

		const {
			personalInfo
		} = this.props;

		const proccessingRequestSmsCode = personalInfo.get('proccessingRequestSmsCode');	// 验证码发送状态
		const proccessingVerifySms = personalInfo.get('proccessingVerifySms');	// 验证码请求状态
		const proccessingSetPassword = personalInfo.get('proccessingSetPassword');	// 设置密码请求状态

		/**
		 * 短信验证码重置剩余时间
		 */
		const smsRetrySurplusTime = this.props.personalInfo.get('smsRetrySurplusTime');	// 短信验证码重置剩余时间
		// console.log('smsRetrySurplusTime 短信验证码重置剩余时间', smsRetrySurplusTime);
		let surplusTime = smsRetrySurplusTime - new Date().getTime();
		if (surplusTime > 0) {	// 如果计算出来的剩余时间>0，说明还没到指定的时间
			surplusTime = parseInt(surplusTime / 1000);
			// console.log('surplusTime 短信验证码重置剩余时间（真实）', surplusTime);
			setTimeout(() => {
				// console.log('【是否卸载】', this);
				this.setState(() => {
					return {
						surplusTime: surplusTime
					}
				});
			}, 1000);
		}

		/**
		 * 当前显示Modal 1：验证手机号；2：重置密码；3：密码重置成功提示
		 */
			// 默认为 1：验证手机号
		let currentModal = 1;
		// 如果hash存在 2：重置密码
		if (proccessingVerifySms && proccessingVerifySms.get('errno') === 0 && proccessingVerifySms.get('data').get('hash')) {
			const hash = proccessingVerifySms.get('data').get('hash');
			currentModal = 2;
		}
		// 如果设置密码成功，3：密码重置成功提示
		if (proccessingSetPassword === 'success') {
			currentModal = 3;
		}

		// 需要根据时间戳计算隐藏图片标签的src
		const validateImgSrc = 'http://y.yunlaiwu.com/sns/validatecode?t=' + this.state.validatecodeTimeStamp;
		// console.log('validateImgSrc', validateImgSrc);

		return (
			<section className={styles.wrapper}>

				{/* 蒙层，用来实现点击外部关闭模态框的功能 */}
				<div
					className={styles.mask}
					onClick={this.handleMaskClick.bind(this)}/>

				{/* 加载中... */}
				{proccessingRequestSmsCode === 'start' || proccessingVerifySms === 0 || proccessingSetPassword === 'start'
					? <Spin isModal={true}/>
					: null
				}

				{/* 这个标签是个隐藏标签，用来获取两个特定的cookie (xingcunzhenmb,validate_session) */}
				<img id="validate-img" src={validateImgSrc} alt=""
					 style={{display: 'none'}}/>

				{/* 验证手机号界面 */}
				{currentModal === 1
					? // 验证手机号
					<section className={styles.passwordSetting}>
						<div className={styles.title}>
							密码设置
						</div>
						<div className={styles.step}>
							<img src={step1Img} alt="验证手机号"/>
						</div>

						{/* 手机号 */}
						<div className={styles.row1}>
							<input
								className={styles.input}
								type="text"
								placeholder="手机号"
								onChange={this.handleMobileNumberChange.bind(this)}
								// 这里主要是切换下方线段颜色
								onFocus={() => {
									this.setState(() => {
										return {
											isMobileInputFocus: true
										}
									});
								}}
								onBlur={() => {
									this.setState(() => {
										return {
											isMobileInputFocus: false
										}
									});
								}}/>
							{/* 正确标识 */}
							{this.state.mobileVerifyStatus === 1
								? <span
									className="iconfont icon-complete"
									style={{
										position: 'absolute',
										right: '0px',
										color: '#44DB5E',
										fontSize: '24px'
									}}/>
								: null
							}
							{/* 错误标识 */}
							{this.state.mobileVerifyStatus === -1
								? <span
									className="iconfont icon-over"
									style={{
										position: 'absolute',
										right: '0px',
										color: '#FF3B30',
										fontSize: '24px'
									}}/>
								: null
							}
						</div>
						<div
							className={this.state.isMobileInputFocus
								? styles.hrActive
								: styles.hr
							}>
							{/* 错误提示 */}
							{this.state.mobileVerifyTips
								? <p className={styles.errorTips}>{this.state.mobileVerifyTips}</p>
								: null
							}
						</div>

						{/* 验证码 */}
						<div className={styles.row2}>
							<input
								className={styles.inputAuthCode}
								type="text"
								placeholder="验证码"
								onChange={this.handleAuthCodeChange.bind(this)}
								// 这里主要是切换下方线段颜色
								onFocus={() => {
									this.setState(() => {
										return {
											isAuthCodeInputFocus: true
										}
									});
								}}
								onBlur={() => {
									this.setState(() => {
										return {
											isAuthCodeInputFocus: false
										}
									});
								}}/>

							{/* 获取短信验证码按钮 */}
							{!this.state.surplusTime
								? <span
									className={styles.getAuthCode}
									onClick={this.handleSendAuthCode.bind(this)}>
									获取验证码
								</span>
								: null
							}

							{/* 短信验证码重置文本 */}
							{this.state.surplusTime
								? <span className={styles.authCodeResend}>
									{this.state.surplusTime}s后重新获取
								</span>
								: null
							}

						</div>
						<div
							className={this.state.isAuthCodeInputFocus
								? styles.hrActive
								: styles.hr
							}>
							{/* 错误提示 */}
							{/* 前端内部校验 */}
							{this.state.authCodeVerifyTips
								? <p className={styles.errorTips}>{this.state.authCodeVerifyTips}</p>
								: null
							}
							{/* 后端接口返回提示信息 */}
							{proccessingVerifySms instanceof Map && proccessingVerifySms.get('errno') === 2006
								? <p className={styles.errorTips}>验证码不正确</p>
								: null
							}
							{/* 后端接口返回提示信息 */}
							{proccessingVerifySms instanceof Map && proccessingVerifySms.get('errno') === 601
								?
								<p className={styles.errorTips}>Send SMS messages beyond the limit of five per day.</p>
								: null
							}
						</div>
						<div
							className={styles.btn}
							onClick={this.handleNextStep.bind(this)}>
							下一步
						</div>
						<div className={styles.tips}>
							手机号已更换？
							<span
								className={styles.rebind}
								onClick={this.handleBindPhoneClick.bind(this)}>
								重新绑定手机号
							</span>
						</div>
					</section>
					: null
				}

				{/* 重置密码界面 proccessingVerifySms 存在 并且 errno===0 并且 hash存在 显示重置密码界面 */}
				{currentModal === 2
					// 重置密码
					? <section className={styles.passwordSetting}>
						<div className={styles.title}>
							密码设置
						</div>
						<div className={styles.step}>
							<img src={step2Img} alt="重置密码"/>
						</div>
						<InputRow
							type="password"
							placeholder="密码"
							verifyStatus={this.state.passwordVerifyStatus}
							verifyTips={this.state.passwordVerifyTips}
							onChange={this.handlePasswordChange.bind(this)}/>
						<InputRow
							type="password"
							placeholder="确认密码"
							verifyStatus={this.state.passwordConfirmVerifyStatus}
							verifyTips={this.state.passwordConfirmVerifyTips}
							onChange={this.handlePasswordConfirmChange.bind(this)}/>
						<div
							className={styles.btn}
							onClick={this.handleSetPassword.bind(this)}>
							提交
						</div>
					</section>
					: null
				}

				{/* 密码设置成功界面 */}
				{currentModal === 3
					// 密码设置成功
					? <section className={styles.passwordSetting}>
						<div className={styles.title}>
							密码设置
						</div>
						<img
							className={styles.successImg}
							src={successImg}
							alt="密码修改成功"/>
						<div className={styles.successTips}>
							恭喜你！密码设置完成,请使用新密码登录
						</div>
						<div
							className={styles.btn}
							onClick={() => {
								if (this.props.onClose) {
									this.props.onClose();
								}
							}}>
							知道了
						</div>
					</section>
					: null
				}
			</section>
		);
	}
}
