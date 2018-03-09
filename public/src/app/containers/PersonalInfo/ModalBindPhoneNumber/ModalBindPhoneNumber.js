/**
 * Created by waka on 2017/4/5.
 */

/********************************** React ****************************************/

import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';

// CSS modules
import styles from './ModalBindPhoneNumber.scss';
import successImg from './success.svg';

// 引入公共组件
import {
	Input,
	Modal,
	Spin
} from '../../../commonComponents';

/********************************** Utils ****************************************/

import {
	verifyMobileNumber,
} from '../../../utils/regExp';

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
	logout,	// 登出
} from '../../../actions/HTTP';

import {
	setSmsRetrySurplusTime,	// 设置短信重置剩余时间
	setModalBindPhoneNumberError,
	setBindPhoneNumberStatus,
} from '../../../actions/PersonalInfo';

import {	// 弹出层
	showWarning,
} from '../../../actions/Popups';

@connect(state => ({
	user: state.get('user'),
	personalInfo: state.get('personalInfo'),
}), dispatch => bindActionCreators({
	requestSmsCode: requestSmsCode.bind(this, dispatch),
	logout: logout.bind(this, dispatch),
	setSmsRetrySurplusTime,
	setModalBindPhoneNumberError,
	setBindPhoneNumberStatus,
	showWarning,
}, dispatch))

/**
 * 绑定手机号模态框
 */
export default class ModalBindPhoneNumber extends Component {

	// 定义属性类型
	static propTypes = {
		mobile: PropTypes.string,	// 原手机号
		onMessageCode: PropTypes.func,	// 短信验证码点击
		onOK: PropTypes.func,	// 确定
		onCancel: PropTypes.func,	// 取消
	};

	// 设置默认属性
	static defaultProps = {
		mobile: '',
		onMessageCode: null,
		onOK: null,
		onCancel: null,
	};

	constructor(props) {
		super(props);

		this.formData = {
			mobile: '',
			authCode: ''
		};

		this.state = {
			surplusTime: 0,	// 短信验证码剩余时间
		}
	}

	componentWillMount() {
		// console.log('【componentWillMount】');
	}

	componentWillUpdate() {
		// console.log('【componentWillUpdate】');
	}

	componentDidUpdate() {
		// console.log('【componentDidUpdate】');
	}

	// 获取验证码
	handleRequestSmsCode() {

		// 校验手机号
		if (!verifyMobileNumber(this.formData.mobile)) {
			this.props.setModalBindPhoneNumberError('您输入的手机号码有误', 1);
			return;
		}

		// 发送短信验证码
		this.props.requestSmsCode(this.formData.mobile);
	}

	render() {

		const proccessingRequestSmsCode = this.props.personalInfo.get('proccessingRequestSmsCode');
		// console.log('请求验证码状态 proccessingRequestSmsCode', proccessingRequestSmsCode);

		const modalBindPhoneNumberError = this.props.personalInfo.get('modalBindPhoneNumberError');
		// console.log('绑定手机号模态框错误 modalBindPhoneNumberError', modalBindPhoneNumberError);

		let bindPhoneNumberStatus = this.props.personalInfo.get('bindPhoneNumberStatus');
		// console.log('绑定手机号状态 bindPhoneNumberStatus', bindPhoneNumberStatus);
		// bindPhoneNumberStatus = 'success';

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
				this.setState(() => {
					return {
						surplusTime: surplusTime
					}
				});
			}, 1000);
		}

		const tips = "原手机号：" + this.props.mobile + "，更换后请使用新手机号登陆";	// 提示

		const validateImgSrc = 'http://y.yunlaiwu.com/sns/validatecode?t=' + new Date().getTime();	// 需要根据时间戳计算隐藏图片标签的src


		let content = '';
		if (bindPhoneNumberStatus !== 'success') {
			content = this.props.mobile ? tips : ''
		}

		return (
			<Modal
				title={bindPhoneNumberStatus === 'success' ? '绑定成功' : '重新绑定手机号'}
				content={content}
				width={460}
				isShowButtons={bindPhoneNumberStatus === 'success' ? false : true}
				onOK={() => {
					if (this.props.onOK) {
						this.props.onOK(this.formData);
					}
				}}
				onCancel={() => {
					if (this.props.onCancel) {
						this.props.onCancel();
					}
					this.props.setBindPhoneNumberStatus('');	// 重置绑定手机状态
				}}>

				{/* 加载框 */}
				{proccessingRequestSmsCode === 'start'
					? <Spin isModal={true}/>
					: null
				}

				{/* 这个标签是个隐藏标签，用来获取两个特定的cookie (xingcunzhenmb,validate_session) */}
				<img id="validate-img" src={validateImgSrc} alt=""
					 style={{display: 'none'}}/>

				{bindPhoneNumberStatus === 'success'

					// 成功提示界面
					? <section className={styles.successWrapper}>
						<img className={styles.successImg} src={successImg} alt=""/>
						<div className={styles.tips1}>恭喜你，重新绑定成功</div>
						<div className={styles.tips2}>请使用新手机号登录</div>
						<div className={styles.btnIKnow}
							 onClick={() => {
								 if (this.props.onCancel) {
									 this.props.onCancel();
								 }
								 this.props.setBindPhoneNumberStatus(''); // 重置绑定手机状态
							 }}>
							知道了
						</div>
					</section>

					// 输入手机号和验证码界面
					: <section>
						{/* 手机号输入 */}
						<div className={styles.row1}>
							<span className={styles.title}>新手机号</span>
							<div className={styles.mobileInput}>
								<Input
									placeholder="请输入新手机号"
									width={290}
									borderColor={(modalBindPhoneNumberError && modalBindPhoneNumberError.errorNumber === 1) ? '#FF3B30' : null}
									onChange={(value) => {
										this.formData.mobile = value;
										this.props.setModalBindPhoneNumberError('', 0);	// 重置错误
									}}
									onError={() => {

									}}/>
							</div>
						</div>

						{/* 短信验证码输入 */}
						<div className={styles.row2}>

							{/* 短信验证码标题 */}
							<span className={styles.title}>短信验证码</span>

							{/* 短信验证码输入框 */}
							<div className={styles.smsInput}>
								<Input
									placeholder="请输入验证码"
									width={160}
									borderColor={(modalBindPhoneNumberError && modalBindPhoneNumberError.errorNumber === 2) ? '#FF3B30' : null}
									onChange={(value) => {
										// console.log('onChange');
										this.formData.authCode = value;
										this.props.setModalBindPhoneNumberError('', 0);	// 重置错误
									}}/>
							</div>

							{/* 获取短信验证码按钮 */}
							{!this.state.surplusTime	// 如果剩余时间 surplusTime===0 或者不存在，显示获取短信验证码
								? <span className={styles.authCode}
										onClick={this.handleRequestSmsCode.bind(this)}>
							获取验证码
						</span>
								: null
							}

							{/* 短信验证码重置文本 */}
							{this.state.surplusTime 	// 如果剩余时间 surplusTime 存在，显示倒计时
								? <span className={styles.authCodeResend}>
							{this.state.surplusTime}s后重新获取
						</span>
								: null
							}

						</div>

						{/* 错误提示区域 */}
						{modalBindPhoneNumberError && modalBindPhoneNumberError.errorTips
							? <div className={styles.errorTipsWrapper}>
						<span className={styles.errorTips}>
							{modalBindPhoneNumberError.errorTips}
						</span>
							</div>
							: null
						}
					</section>
				}

			</Modal>
		);
	}

	componentWillUnmount() {
		// console.log('【componentWillUnmount】');
		this.props.setModalBindPhoneNumberError('', 0);	// 清空store中的错误信息
	}

};
