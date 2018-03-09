import React, {
	Component
} from 'react';

import PropTypes from 'prop-types';

// 样式
import styles from './CopyrightProtectionAssociationModal.scss';

// ant-d
import {
	Radio,	// 单选按钮
	Input,
	Spin,	// 加载中
} from 'antd';

const RadioGroup = Radio.Group;

// redux
import {
	bindActionCreators
} from 'redux';
import {
	connect
} from 'react-redux';

import {
	initCopyrightProtection,
	getCopyrightProtectionRecordsByCookie,
	changeCurrentSelectCopyId,
	copyrightProtectionAssociationByCopyId,
	changeCurrentCopyrightProtectionErrorTips,
	changeCurrentCopyrightProtectionMode,
	getWorkDetailByCopyId,
	setWorkDetailByCopyId,
	getCopyIdByIppreId,
} from '../../actions/CopyrightProtectionAssociationModal';

@connect(state => ({
	user: state.get('user'),
	copyrightProtectionAssociationModal: state.get('copyrightProtectionAssociationModal'),
}), dispatch => bindActionCreators({
	getCopyrightProtectionRecordsByCookie: getCopyrightProtectionRecordsByCookie.bind(this, dispatch),
	copyrightProtectionAssociationByCopyId: copyrightProtectionAssociationByCopyId.bind(this, dispatch),
	changeCurrentSelectCopyId: changeCurrentSelectCopyId,
	changeCurrentCopyrightProtectionErrorTips: changeCurrentCopyrightProtectionErrorTips,
	changeCurrentCopyrightProtectionMode: changeCurrentCopyrightProtectionMode,
	initCopyrightProtection: initCopyrightProtection,
	getWorkDetailByCopyId: getWorkDetailByCopyId.bind(this, dispatch),
	setWorkDetailByCopyId: setWorkDetailByCopyId,
	getCopyIdByIppreId: getCopyIdByIppreId.bind(this, dispatch),
}, dispatch))

/**
 * 版保关联弹窗
 */
export default class CopyrightProtectionAssociationModal extends Component {

	// 定义属性类型
	static propTypes = {
		author: PropTypes.string,	// 作者名
		leanId: PropTypes.string,	// leancloud ippre表objectId
		workTitle: PropTypes.string,	// 作品名
		onClose: PropTypes.func,	// 关闭事件
	};

	// 设置默认属性
	static defaultProps = {
		author: '',
		leanId: '',
		workTitle: '',
		onClose: null,
	};

	constructor(props) {
		super(props);

		this.state = {
			tab: 1,	// 当前 tab 栏
			radioValue1: 0,	// 第一级单选按钮栏
			radioValue2: 0,	// 第二级单选按钮栏
		};

		this.currentHandCopyId = '';	// 当前手动输入的版保号
	}

	componentWillMount() {
		const {
			getCopyrightProtectionRecordsByCookie,
			getCopyIdByIppreId,
			leanId,
		} = this.props;

		// 获取版保记录数据
		getCopyrightProtectionRecordsByCookie();
		getCopyIdByIppreId(leanId);
	}

	componentWillUnmount() {
		const {
			initCopyrightProtection,
		} = this.props;

		// 初始化版保数据
		initCopyrightProtection();
	}

	handleCloseClick() {
		// console.log('关闭按钮');
		if (this.props.onClose) {
			this.props.onClose();
		}
	}

	// 作品未申请版保 Tab 点击
	handleNoCopyrightProtectionTabClick() {
		this.setState({
			tab: 1,
		});
	}

	// 作品已申请版保 Tab 点击
	handleHasCopyrightProtectionTabClick() {
		this.setState({
			tab: 2,
		});
	}

	// 版保记录和手动输入版保记录切换
	handleChangeRecordOrHandRadioGroupChange(e) {
		const {
			changeCurrentCopyrightProtectionMode,
		} = this.props;

		this.setState({
			radioValue1: e.target.value,
		});

		// 改变模式
		changeCurrentCopyrightProtectionMode(e.target.value);

		// 清空错误信息
		this.props.changeCurrentCopyrightProtectionErrorTips({
			errorTips: '',
			color: ''
		});
	}

	// 版保记录单选按钮组改变
	handleCopyrightRecordsRadioGroupChange(e) {
		const {
			copyrightProtectionAssociationModal,
			changeCurrentSelectCopyId,
		} = this.props;

		const records = copyrightProtectionAssociationModal.get('copyrightProjectionRecords').toJS().array;

		const index = e.target.value;
		this.setState({
			radioValue2: index,
		});
		if (records.length > 0 && records[index] && records[index].copyId) {
			// 改变当前选中的 copyId
			changeCurrentSelectCopyId(records[index].copyId);
		}
	}

	// 手动输入版保号 change
	handleHandInputCopyIdChange(e) {
		// console.log(e.target.value);
		const {
			getWorkDetailByCopyId,
			setWorkDetailByCopyId,
		} = this.props;

		this.currentHandCopyId = e.target.value;

		// 清空错误提示
		this.props.changeCurrentCopyrightProtectionErrorTips({
			errorTips: '',
			color: ''
		});

		if (e.target.value.length === 32) {
			getWorkDetailByCopyId(e.target.value);
		} else {
			setWorkDetailByCopyId({
				data: {},
				isLoading: false,
			})
		}
	}

	// 确定按钮点击
	handleConfirmClick() {
		const {
			copyrightProtectionAssociationModal,
			leanId,
			copyrightProtectionAssociationByCopyId,
			changeCurrentCopyrightProtectionErrorTips,
		} = this.props;

		// 当前选中 copyId
		const currentSelectCopyId = copyrightProtectionAssociationModal.get('currentSelectCopyId');
		// 当前模式
		const currentCopyrightProtectionMode = copyrightProtectionAssociationModal.get('currentCopyrightProtectionMode');

		let data = {};
		// 第一级选择器为0，代表使用版保记录做关联
		if (currentCopyrightProtectionMode === 0) {
			data = {
				copyId: currentSelectCopyId,
				leanId: leanId,
			};
			// console.log('版保关联数据（使用版保记录做关联） data', data);
		}
		// 第一级选择器为1，代表使用手动输入版保号做关联
		else if (currentCopyrightProtectionMode === 1) {
			if (!this.currentHandCopyId) {
				changeCurrentCopyrightProtectionErrorTips({
					errorTips: '版保关联号不能为空',
					color: 'red'
				});
				return;
			}
			data = {
				copyId: this.currentHandCopyId,
				leanId: leanId,
			};
			// console.log('版保关联数据（手动输入版保号做关联） data', data);
		}
		copyrightProtectionAssociationByCopyId(data);
	}

	render() {

		const {
			leanId,
			author,
			workTitle,
			copyrightProtectionAssociationModal,
		} = this.props;
		// console.log('leanId', leanId);

		const {
			tab,
			radioValue1,
			radioValue2,
		} = this.state;

		// 版保记录数组
		const records = copyrightProtectionAssociationModal.get('copyrightProjectionRecords').toJS().array;
		// 版保记录加载状态
		const recordsIsLoading = copyrightProtectionAssociationModal.get('copyrightProjectionRecords').toJS().isLoading;
		// 当前选中的版保号
		const currentSelectCopyId = copyrightProtectionAssociationModal.get('currentSelectCopyId');

		// 错误提示
		const currentCopyrightProtectionErrorTips = copyrightProtectionAssociationModal.get('currentCopyrightProtectionErrorTips').toJS();

		// 当前模式
		const currentCopyrightProtectionMode = copyrightProtectionAssociationModal.get('currentCopyrightProtectionMode');

		// 版保关联相关
		const copyrightProtectionAssociationByCopyid = copyrightProtectionAssociationModal.get('copyrightProtectionAssociationByCopyid').toJS();
		// 版保关联加载状态
		const copyrightProtectionAssociationByCopyidIsLoading = copyrightProtectionAssociationByCopyid.isLoading;
		// 版保关联是否成功标识
		const copyrightProtectionAssociationByCopyidIsSuccess = copyrightProtectionAssociationByCopyid.isSuccess;
		// 如果关联成功，关闭对话框
		if (copyrightProtectionAssociationByCopyidIsSuccess) {
			this.handleCloseClick();
		}

		// 根据 copyId 获得的作品标题
		const workTitleByCopyId = copyrightProtectionAssociationModal.get('workDetailByCopyId').toJS().data.title;

		// 跳转至版保链接
		let copyrightProtectionLinkHost = 'http://dci.yunlaiwu.com';
		if (NODE_SERVER_ENV === 'development' || NODE_SERVER_ENV === 'test') {
			copyrightProtectionLinkHost = 'http://testdci.yunlaiwu.com';
		}
		let author2 = encodeURIComponent(author);
		let workTitle2 = encodeURIComponent(workTitle);
		let copyrightProtectionLink = `${copyrightProtectionLinkHost}/dci/form/worksRegister?ippreId=${leanId}&author=${author2}&title=${workTitle2}#?step=1`;
		const copyId = copyrightProtectionAssociationModal.get('getCopyIdByIppreId').get('copyId');
		if (copyId) {
			copyrightProtectionLink = `${copyrightProtectionLinkHost}/dci/form/worksRegister?ippreId=${leanId}&copyId=${copyId}&author=${author2}&title=${workTitle2}#?step=1`;
		}

		return <section className={styles.wrapper}>
			<section className={styles.main}>

				<i className="iconfont icon-close"
				   style={{
					   color: '#d4d9e2',
					   position: 'absolute',
					   top: '17px',
					   right: '17px',
					   cursor: 'pointer',
				   }}
				   onClick={this.handleCloseClick.bind(this)}/>

				{/* tab 栏 */}
				<section className={styles.tab}>
					<div className={tab === 1 ? styles.itemSelect : styles.item}
						 onClick={this.handleNoCopyrightProtectionTabClick.bind(this)}>
						作品未申请版保
					</div>
					<div className={tab === 2 ? styles.itemSelect : styles.item}
						 onClick={this.handleHasCopyrightProtectionTabClick.bind(this)}>
						作品已申请版保
					</div>
				</section>

				{/* 作品未申请版保 */}
				{tab === 1 &&
				<section className={styles.noCopyrightProtection}>
					<a className={styles.btn}
					   target="_blank"
					   href={copyrightProtectionLink}
					   onClick={this.handleCloseClick.bind(this)}>
						马上去申请
					</a>
					<div className={styles.tips}>申请后可享有免费DCI证书和免费法务咨询</div>
				</section>
				}

				{/* 作品已申请版保 */}
				{tab === 2 &&
				<Spin size="large"
					  spinning={copyrightProtectionAssociationByCopyidIsLoading || recordsIsLoading}>
					<section className={styles.hasCopyrightProtection}>
						{/* 判断作者是否有版保记录 */}
						{/* 有版保记录 */}
						{records.length > 0 && !recordsIsLoading &&
						<RadioGroup className={styles.radioGroup}
									value={radioValue1}
									onChange={this.handleChangeRecordOrHandRadioGroupChange.bind(this)}>
							<Radio className={styles.radio}
								   value={0}
								   style={{
									   color: radioValue1 === 0 && '#596377'
								   }}>
								已列出您在版权中心的版保记录，请选择对应作品进行关联
								{/* 版保记录列表 */}
								{radioValue1 === 0 &&
								<section className={styles.recordList}>
									<RadioGroup className={styles.radioGroup2}
												value={radioValue2}
												onChange={this.handleCopyrightRecordsRadioGroupChange.bind(this)}>
										{records.map((item, index) => {
											return <Radio className={styles.radio2}
														  value={index}
														  key={index}
														  style={{
															  color: radioValue2 === index && '#596377'
														  }}>
												《{item.title}》{item.author}
											</Radio>
										})
										}
									</RadioGroup>
								</section>
								}
							</Radio>
							<Radio className={styles.radio}
								   value={1}
								   style={{
									   color: radioValue1 === 1 && '#596377'
								   }}>
								通过版保关联号进行关联
								{radioValue1 === 1 &&
								<section className={styles.associateByCopyrightNumber}>
									<div className={styles.row1}>
										<Input className={styles.input}
											   onChange={this.handleHandInputCopyIdChange.bind(this)}
											   defaultValue={this.currentHandCopyId}
											   placeholder="版保关联号"
											   style={{
												   borderColor: currentCopyrightProtectionErrorTips.color === 'red' && currentCopyrightProtectionErrorTips.color
											   }}/>
										<section className={styles.tips}>
											{!currentCopyrightProtectionErrorTips.errorTips && workTitleByCopyId &&
											<div className={styles.workTitleTips}
												 title={`《${workTitleByCopyId}》`}>
												作品《{workTitleByCopyId}》
											</div>
											}
											{currentCopyrightProtectionErrorTips.errorTips &&
											<div className={styles.errorTips}
												 style={{
													 color: currentCopyrightProtectionErrorTips.color && currentCopyrightProtectionErrorTips.color
												 }}>
												{currentCopyrightProtectionErrorTips.errorTips}
											</div>
											}
										</section>
									</div>
									<div className={styles.row2}>
										如果系统没有找到您要的版保记录，您可以通过关联号进行手动关联
									</div>
									<div className={styles.btnConfirm}
										 onClick={this.handleConfirmClick.bind(this)}>
										确定
									</div>
									<div className={styles.tips3}>什么是版保关联号？</div>
									<div className={styles.tips4}>
										版保关联号用于将作品与作品的版保证书进行关联。<br/>
										当您在云莱坞交易平台上传作品时，如果此作品已在云莱坞版保中心做过版保，就能通过版保关联号为此作品打上版保的标志。
									</div>
									<div className={styles.tips3}>如何获取版保关联号？</div>
									{/* 一张图片 */}
									<div className={styles.img}
										 style={{
											 backgroundImage: 'url(//yunlaiwu0.cn-bj.ufileos.com/copyrightProtectionAssociation.png)'
										 }}/>
								</section>
								}
							</Radio>
						</RadioGroup>
						}

						{/* 无版保记录 */}
						{/* 不显示 Radio 按钮 */}
						{records.length === 0 && !recordsIsLoading &&
						<section className={styles.associateByCopyrightNumberNoRecord}>
							<div className={styles.title}>通过版保关联号进行关联</div>
							<div className={styles.row1}>
								<Input className={styles.input}
									   onChange={this.handleHandInputCopyIdChange.bind(this)}
									   defaultValue={this.currentHandCopyId}
									   placeholder="版保关联号"
									   style={{
										   borderColor: currentCopyrightProtectionErrorTips.color === 'red' && currentCopyrightProtectionErrorTips.color
									   }}/>
								<section className={styles.tips}>
									{!currentCopyrightProtectionErrorTips.errorTips && workTitleByCopyId &&
									<div className={styles.workTitleTips}
										 title={`《${workTitleByCopyId}》`}>
										作品《{workTitleByCopyId}》
									</div>
									}
									{currentCopyrightProtectionErrorTips.errorTips &&
									<div className={styles.errorTips}
										 style={{
											 color: currentCopyrightProtectionErrorTips.color && currentCopyrightProtectionErrorTips.color
										 }}>
										{currentCopyrightProtectionErrorTips.errorTips}
									</div>
									}
								</section>
							</div>
							<div className={styles.row2}>
								如果系统没有找到您要的版保记录，您可以通过关联号进行手动关联
							</div>
							<div className={styles.btnConfirm}
								 onClick={this.handleConfirmClick.bind(this)}>
								确定
							</div>
							<div className={styles.tips3}>什么是版保关联号？</div>
							<div className={styles.tips4}>
								版保关联号用于将作品与作品的版保证书进行关联。<br/>
								当您在云莱坞交易平台上传作品时，如果此作品已在云莱坞版保中心进行了版保，就可以通过版保关联号为此作品打上版保的标志C。
							</div>
							<div className={styles.tips3}>如何获取版保关联号？</div>
							{/* 一张图片 */}
							<div className={styles.img}
								 style={{
									 backgroundImage: 'url(//yunlaiwu0.cn-bj.ufileos.com/copyrightProtectionAssociation.png)'
								 }}/>
						</section>
						}
						{currentCopyrightProtectionMode === 0 &&
						<div className={styles.btnConfirm}
							 onClick={this.handleConfirmClick.bind(this)}>
							确定
						</div>
						}
					</section>
				</Spin>
				}

			</section>
		</section>
	}
}
