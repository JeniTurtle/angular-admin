/**
 * Created by waka on 2017/4/7.
 */

/********************************** React ****************************************/

import React, {
	Component,
} from 'react';

// 引入样式
import styles from './PersonalInfo.scss';

// 引入公共组件
import {
	Spin
} from '../../commonComponents'

// 引入内部组件
import {
	BaseInfo,	// 基本信息
	AuthInfo,	// 认证信息
	PasswordInfo,	// 密码信息
	BindInfo, // 绑定信息
	ModalAddMagnumOpusItem,
	ModalBindPhoneNumber,
	ModalDeleteMagnumOpusItem,
	ModalPasswordSetting,
} from './index';

// 引入存在的组件
import {
	Nav,
	Avatar,
} from '../../components';

/********************************** Utils ****************************************/

import {
	verifyMobileNumber,
	verifyEmail,
	verifyAuthCode,
} from '../../utils/regExp';

import {
	query,
} from '../../utils/url';

/********************************** Redux ****************************************/

import {
	bindActionCreators
} from 'redux';

import {
	connect
} from 'react-redux';

// 引入action
import {
	fetchPersonalInfo,	// 获得个人信息
	updatePersonalInfo,	// 提交个人信息
	fetchHistories,	// 获得代表作品
	addHistory,	// 创建代表作品
	deleteHistory,	// 删除代表作品
	updateHistory,	// 更新代表作品
	setMobile,	// 绑定手机号
} from '../../actions/HTTP';

import {	// 弹出层
	showToast,
	showWarning,
	showPopup,
	showSpin,
	hideSpin,
	showAlert,
} from '../../actions/Popups';

import {
	setModalBindPhoneNumberError,	// 设置绑定手机对话框错误
	setModalAddRepresentativeWorksData,	// 设置添加代表作品对话框数据
	setModalAddRepresentativeWorksShowToggle,	// 设置添加代表作品对话框显示开关
} from '../../actions/PersonalInfo';

@connect(state => ({
	user: state.get('user'),
	personalInfo: state.get('personalInfo'),
	histories: state.get('histories'),
}), dispatch => bindActionCreators({
	fetchGetPersonalInfo: fetchPersonalInfo.bind(this, dispatch),
	updatePersonalInfo: updatePersonalInfo.bind(this, dispatch),
	fetchHistories: fetchHistories.bind(this, dispatch),
	addHistory: addHistory.bind(this, dispatch),
	deleteHistory: deleteHistory.bind(this, dispatch),
	updateHistory: updateHistory.bind(this, dispatch),
	setMobile: setMobile.bind(this, dispatch),
	setModalBindPhoneNumberError,
	setModalAddRepresentativeWorksData,
	setModalAddRepresentativeWorksShowToggle,
	showToast,
	showWarning,
	showPopup,
	showSpin,
	hideSpin,
	showAlert,
}, dispatch))

/**
 * 个人信息
 */
export default class PersonalInfo extends Component {

	constructor(props) {
		super(props);

		// 初始化表单数据
		this.sex = '';	// 性别
		this.email = '';	// 邮箱
		this.desc = '';	// 简介
		this.descError = false;	// 个人简介输入错误

		// 控制状态 initial state
		this.state = {
			// 基本信息
			emailErrorTips: '',	// 邮箱错误提示
			descErrorTips: '',	// 个人简介错误提示
			isShowModalUploadAvatar: false,	// 是否显示上传头像模态框
			isBaseInfoEdit: false,	// 基础信息是否处于编辑状态
			sex: '',
			typeModalAddMagnumOpusItem: 'add',	// 增加代表作品模态框类型：add/edit
			isShowModalAddMagnumOpusItem: false,	// 是否显示增加代表作品模态框
			isShowModalDeleteMagnumOpusItem: false,	// 是否显示删除代表作品模态框
			textModalDeleteMagnumOpusItem: '您确定要删除该代表作品吗？',	// 文本,删除代表作品模态框
			// 密码信息
			isShowModalPasswordSetting: false,	// 是否显示密码设置对话框
			// 绑定信息
			isShowModalBindPhoneNumber: false,	// 是否显示绑定手机号模态框
		};
	}

	componentWillMount() {

		// 拉取数据
		this.props.fetchGetPersonalInfo();	// 拉取个人信息
		this.props.fetchHistories();	// 拉取代表作品列表

		/**
		 * 实现功能：从其它页带参数 isShowModalUploadAvatar=true 跳转过来，自动打开上传头像模态框
		 */
		let isShowModalUploadAvatar = query(location.href, 'isShowModalUploadAvatar');
		// console.log('【isShowModalUploadAvatar 是否显示上传头像对话框】', isShowModalUploadAvatar);
		if (isShowModalUploadAvatar) {
			this.setState(() => {
				return {
					isShowModalUploadAvatar: true
				}
			});
		}

		/**
		 * 实现功能：从其它页带参数 isBaseInfoEdit=true 跳转过来，自动切换为编辑基本信息模式
		 */
		let isBaseInfoEdit = query(location.href, 'isBaseInfoEdit');
		if (isBaseInfoEdit) {
			this.setState(() => {
				return {
					isBaseInfoEdit: true
				}
			});
		}
	}

	componentDidMount() {
		// console.log('componentDidMount', this.props.personalInfo.toJS());
	}

	componentWillUpdate() {
		// console.log('componentWillUpdate', this.props.personalInfo.toJS());
	}

	componentDidUpdate() {
		// console.log('componentWillUpdate');

		const {
			personalInfo,
		} = this.props;

		const loadingState = personalInfo.get('loadingState');	// 个人信息加载状态
		const processingUpdatePersonalInfo = personalInfo.get('processingUpdatePersonalInfo');	// 更新个人信息操作结果
		const proccessingSetMobile = personalInfo.get('proccessingSetMobile');	// 绑定手机号修改结果

		// 更新个人信息成功 并且 基础信息模态框处于编辑状态
		if (processingUpdatePersonalInfo === 'success' && this.state.isBaseInfoEdit) {
			// 关闭编辑状态
			this.setState(() => {
				return {
					isBaseInfoEdit: false,
				};
			});
		}

		// // 绑定手机成功 且 绑定手机对话框处于打开状态
		// if (proccessingSetMobile === 'success' && this.state.isShowModalBindPhoneNumber) {
		// 	this.setState(() => {
		// 		return {
		// 			isShowModalBindPhoneNumber: false
		// 		};
		// 	});
		// }
	}

	render() {

		/****************************** 从store取得state *******************************/

		const {
			personalInfo,	// 个人信息
			histories,	// 代表作品列表
		} = this.props;

		/****************************** 拿到需要的字段 *******************************/

			// 个人信息
		const loadingStatePersonalInfo = personalInfo.get('loadingState');	// 个人信息数据加载状态，期望值为 'start' 和 'success'
		const processingUpdatePersonalInfo = personalInfo.get('processingUpdatePersonalInfo');	// 更新个人信息修改结果
		const proccessingSetMobile = personalInfo.get('proccessingSetMobile');	// 绑定手机号修改结果

		// 代表作品
		const loadingStateHistories = histories.get('loadingState');	// 代表作品数据加载状态
		const proccessingDelHistory = histories.get('proccessingDelHistory');	// 删除代表作品状态
		const proccessingAddHistory = histories.get('proccessingAddHistory');	// 添加代表作品状态
		const processingUpdateHistory = histories.get('processingUpdateHistory');	// 更新代表作品状态
		const modalAddRepresentativeWorksData = this.props.personalInfo.get('modalAddRepresentativeWorksData');
		// console.log('添加代表作品对话框数据 modalAddRepresentativeWorksData', modalAddRepresentativeWorksData);
		const modalAddRepresentativeWorksShowToggle = this.props.personalInfo.get('modalAddRepresentativeWorksShowToggle');
		// console.log('添加代表作品对话框显示开关 modalAddRepresentativeWorksShowToggle', modalAddRepresentativeWorksShowToggle);

		/* 基本信息 */
		const avatar = personalInfo.get('avatar');	// 头像
		const sex = personalInfo.get('sex');	// 性别
		const email = personalInfo.get('email');	// 邮箱
		const desc = personalInfo.get('desc');	// 个人简介
		let hisworks = histories.get('list');	// 代表作品
		hisworks = hisworks.filter((item) => {	// 筛选出存在的代表作品，过滤掉已被删除的代表作品
			// 只有state===1才代表该代表作品存在
			if (item.get('status') === 1) {
				return true;
			}
		});

		// console.log('personalInfo',personalInfo.toJS());

		/* 认证信息 */
		const ability = personalInfo.get('ability');	// 能力，这两个用来判断用户类型
		const type = personalInfo.get('type');	// 类型，这两个用来判断用户类型
		const authState = personalInfo.get('authState');	// 认证状态
		const authData = personalInfo.get('authData');	// 认证信息
		const name = personalInfo.get('username');	// 名字
		const company = authData ? authData.get('company') : '';	// 公司
		const role = authData ? authData.get('role') : '';	// 角色
		const authRole = personalInfo.get('authRole');	// 认证身份
		let authDetail = '';	// 认证详细
		if (ability === 1 && type === 1) {	// 写作者
			authDetail = role;
		} else if (ability === 2 && type === 1) {	// 影视人
			authDetail = company + '·' + role;
		} else if (type === 2) {	// 版权机构
		}

		/* 绑定信息 */
		const mobile = personalInfo.get('mobile');	// 手机号
		const wxname = personalInfo.get('wxname');	// 微信号
		const wbname = personalInfo.get('wbname');	// 微博号

		/*************************** 基本信息提交 ******************************/

		// 初始化需要提交的表单数据，第一次时从personalInfo获取，可能不是很优雅，但是顶用
		if (!this.sex) {
			this.sex = sex;
		}
		if (!this.email && !this.myChange) {
			this.email = email;
		}
		if (!this.desc && !this.myChange) {
			this.desc = desc;
		}

		return (
			<section className={styles.wrapper}>

				{/* 加载中... */}
				{loadingStatePersonalInfo === 'start' || processingUpdatePersonalInfo === 'start' || loadingStateHistories === 'start' || proccessingDelHistory === 'start' || proccessingAddHistory === 'start' || processingUpdateHistory === 'start' || proccessingSetMobile === 'start'
					? <Spin isModal={true}/>
					: null
				}

				{/* 上传头像模态框 */}
				{this.state.isShowModalUploadAvatar
					? <Avatar closed={() => {
						this.setState(() => {
							return {
								isShowModalUploadAvatar: false,
							};
						});
					}}/>
					: null
				}

				{/* 添加代表作品模态框 */}
				{modalAddRepresentativeWorksShowToggle
					? <ModalAddMagnumOpusItem
						hisworkIndex={this.indexModelAddMagnumOpusItem}
						hisworkItemData={this.state.typeModalAddMagnumOpusItem === 'edit' ? this.hisworkItemDataModelAddMagnumOpusItem : null}
						type={this.state.typeModalAddMagnumOpusItem}
						isShow={true}
						onCancel={() => {
							this.props.setModalAddRepresentativeWorksShowToggle(false);
						}}
						onAddHiswork={(formData, hisworksId) => {
							// console.log('onAddHiswork formData', formData, 'hisworksId', hisworksId);
							// 添加
							this.props.addHistory(formData);
						}}/>
					: null
				}

				{/* 删除代表作品模态框 */}
				<ModalDeleteMagnumOpusItem
					text={this.state.textModalDeleteMagnumOpusItem}
					isShow={this.state.isShowModalDeleteMagnumOpusItem}
					onOK={() => {
						// console.log(this.indexDeleteMagnumOpusItem, this.dataDeleteMagnumOpusItem);
						const hisworksId = this.dataDeleteMagnumOpusItem.hisworksId;
						this.props.deleteHistory(hisworksId);	// 调用删除接口
						this.setState(() => {	// 关闭删除对话框
							return {
								isShowModalDeleteMagnumOpusItem: false
							};
						});
					}}
					onCancel={() => {
						this.setState(() => {
							return {
								isShowModalDeleteMagnumOpusItem: false
							};
						});
					}}/>

				{/* 绑定电话号码模态框 */}
				{this.state.isShowModalBindPhoneNumber
					? <ModalBindPhoneNumber
						mobile={mobile}
						isShow={this.state.isShowModalBindPhoneNumber}
						onOK={(formData) => {
							// console.log(formData);

							if (!formData.mobile) {
								this.props.setModalBindPhoneNumberError('请输入手机号', 1);
								return;
							}

							// 校验手机号
							if (!verifyMobileNumber(formData.mobile)) {
								// this.props.showWarning('您输入的手机号码有误', 'danger');
								this.props.setModalBindPhoneNumberError('您输入的手机号码有误', 1);
								return;
							}

							if (!formData.authCode) {
								this.props.setModalBindPhoneNumberError('请输入验证码', 2);
								return;
							}

							// 校验验证码
							if (!verifyAuthCode(formData.authCode)) {
								// this.props.showWarning('验证码不正确', 'danger');
								this.props.setModalBindPhoneNumberError('验证码不正确', 2);
								return;
							}

							// 绑定手机号
							this.props.setMobile(formData.mobile, formData.authCode);
						}}
						onCancel={() => {
							this.setState(() => {
								return {
									isShowModalBindPhoneNumber: false
								};
							});
						}}/>
					: null
				}

				{/* 密码设置模态框 */}
				{this.state.isShowModalPasswordSetting
					? <ModalPasswordSetting
						onClose={() => {
							this.setState(() => {
								return {
									isShowModalPasswordSetting: false
								}
							})
						}}
						onBindPhoneClick={() => {
							this.setState(() => {
								return {
									isShowModalPasswordSetting: false,
									isShowModalBindPhoneNumber: true,
								}
							})
						}}/>
					: null
				}

				{/* 左侧导航栏 */}
				<section className={styles.nav}>
					<Nav path={this.props.path}/>
				</section>

				<section className={styles.personalInfoWrapper}>

					{/* 个人信息 */}
					<div className={styles.personalInfo}>

						{/* 头像 */}
						<div className={styles.avatarWrapper}>
							<div className={styles.avatar}>
								<div
									className={styles.avatarLayer}
									onClick={() => {
										this.setState(() => {
											return {
												isShowModalUploadAvatar: true,
											};
										});
									}}>
									重新上传
								</div>
								<img width="100%" height="100%" alt="用户头像" src={this.props.user.get('avatar')}/>
							</div>
						</div>

						{/* 基本信息 */}
						<BaseInfo
							isEditStatus={this.state.isBaseInfoEdit}    // 是否是编辑状态
							onEditClick={() => {	// 编辑按钮点击
								this.setState(() => {
									return {isBaseInfoEdit: true};
								});
							}}
							sex={this.state.isBaseInfoEdit 	// 性别；判断是否是编辑模式
								? this.sex 	// 编辑模式使用state中的sex
								: sex 	// 正常模式使用store中的sex
							}
							onSexChange={(index) => {	// 性别切换
								this.setState(() => {
									return {sex: ['男', '女'][index]};
								});
								this.sex = ['男', '女'][index];
							}}
							email={email}    // 邮箱
							emailErrorTips={this.state.emailErrorTips}
							isEmailInputFocus={this.state.emailErrorTips ? true : false}
							onEmailChange={(email) => {	// email change
								this.myChange = true;	// 主动修改标志量
								this.setState(() => {
									return {
										email,
										emailErrorTips: ''
									};
								});
								this.email = email;
							}}
							desc={desc}
							descErrorTips={this.state.descErrorTips}
							onDescChange={(desc) => {	// 个人简介 change
								this.myChange = true;	// 主动修改标志量
								this.setState(() => {
									return {desc};
								});
								this.desc = desc;
								if (this.descError) {
									this.setState(() => {
										return {
											descErrorTips: '个人简介字数过多'
										}
									});
								} else {
									this.setState(() => {
										return {
											descErrorTips: ''
										}
									});
								}
							}}
							onDescError={(isError) => {	// 个人简介 字数超过 错误
								// console.log('onDescError isError', isError);
								this.descError = isError;
							}}
							magnumOpus={hisworks}
							// 编辑代表作品
							onEditMagnumOpusItem={(index, hisworkItemData) => {
								// console.log('onEditMagnumOpusItem', index);

								this.indexModelAddMagnumOpusItem = index;
								this.hisworkItemDataModelAddMagnumOpusItem = hisworkItemData;
								this.props.setModalAddRepresentativeWorksData({
									status: 'edit',
									hisworkId: hisworkItemData.hisworksId,
									title: hisworkItemData.title,
									workType: hisworkItemData.workType,
									publisher: hisworkItemData.publisher,
									publishTime: hisworkItemData.publishTime,
									achievement: hisworkItemData.achievement
								});

								this.setState(() => {
									return {
										typeModalAddMagnumOpusItem: 'edit',
									};
								});
								this.props.setModalAddRepresentativeWorksShowToggle(true);
							}}
							// 删除代表作品
							onDeleteMagnumOpusItem={(index, magnumOpusItem) => {
								// 保存在临时变量里
								this.indexDeleteMagnumOpusItem = index;
								this.dataDeleteMagnumOpusItem = magnumOpusItem;

								this.setState(() => {
									return {
										textModalDeleteMagnumOpusItem: '您确定要删除《' + magnumOpusItem.title + '》吗？',
										isShowModalDeleteMagnumOpusItem: true
									};
								});
							}}
							// 添加代表作品
							onAddMagnumOpusItem={() => {
								this.indexModelAddMagnumOpusItem = hisworks.size + 1;
								this.setState(() => {
									return {
										typeModalAddMagnumOpusItem: 'add',
									};
								});
								this.props.setModalAddRepresentativeWorksShowToggle(true);
							}}
							// 保存按钮
							onOK={() => {
								// console.log('表单项', this.sex, this.email, this.desc);

								// 如果性别为空，让性别为男，因为默认为男
								if (!this.sex) {
									this.sex = '男';
								}

								// 校验邮箱
								if (this.email && !verifyEmail(this.email)) {
									// this.props.showWarning('邮箱格式错误，请检查', 'danger');
									this.setState(() => {
										return {
											emailErrorTips: '邮箱格式错误，请检查'
										}
									});
									return;
								}

								// 这里的逻辑是，如果原邮箱存在，则邮箱为必填
								let originEmail = this.props.personalInfo.get('email');	// 获得原邮箱
								// console.log('originEmail', originEmail);
								// console.log('this.email', this.email);
								if (originEmail && !this.email) {
									this.setState(() => {
										return {
											emailErrorTips: '请填写邮箱'
										}
									});
									return;
								}

								// 校验个人简介
								if (this.descError) {
									this.props.showAlert('个人简介字数过多', 'error');
									return;
								}

								// 请求，更新个人信息
								this.props.updatePersonalInfo(this.sex, this.email, this.desc);

							}}
							// 取消按钮
							onCancel={() => {
								// 重置state
								this.setState(() => {
									return {
										isBaseInfoEdit: false,	// 关闭编辑状态
										sex: sex,	// 重置回原来的值
										email: email,	// 重置回原来的值
										desc: desc,	// 重置回原来的值
										emailErrorTips: '',
									};
								});
								// 重置回原来的值
								// this.sex = sex;
								this.email = email;
								// this.desc = desc;
							}}/>

						{/* 认证信息 */}
						<AuthInfo
							authState={authState}
							ability={ability}
							type={type}
							name={name}
							detail={authRole}
						/>

						{/* 密码信息 */}
						<PasswordInfo
							middleText={mobile
								? ''
								: '请先绑定手机号'
							}
							rightText={mobile
								? '设置'
								: '绑定手机号'
							}
							onRightClick={() => {
								// console.log('onRightClick');
								this.setState((prevState) => {
									return {
										isShowModalPasswordSetting: !prevState.isShowModalPasswordSetting
									}
								});
							}}/>

						{/* 绑定信息 */}
						<BindInfo
							phone={mobile
								? mobile
								: '增加账号的安全性，建议您绑定'
							}
							phoneRightText={mobile
								? '更换'
								: '绑定'
							}
							// 绑定手机
							onBindPhoneClick={() => {
								// console.log('onBindPhoneClick');
								this.setState(() => {
									return {isShowModalBindPhoneNumber: true};
								});
							}}
							wechat={wxname
								? wxname
								: '绑定后可使用微信快速登录，接收重要消息'
							}
							wechatRightText={wxname
								? '更换'
								: '绑定'
							}
							// 绑定微信
							onBindWechatClick={() => {
								// console.log('onBindWechatClick');
							}}
							weibo={wbname
								? wbname
								: ''
							}
							weiboRightText={wbname
								? '更换'
								: '绑定'
							}
							// 绑定微博
							onBindWeiboClick={() => {
								// console.log('onBindWeiboClick');
							}}/>

						{/* 与底部的分隔 */}
						<div style={{height: '40px'}}/>

					</div>
				</section>
			</section>
		);
	}
}
